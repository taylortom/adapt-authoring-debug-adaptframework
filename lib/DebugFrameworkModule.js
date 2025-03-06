import { AbstractModule } from 'adapt-authoring-core';
import fs from 'fs/promises';
import path from 'path';
import zipper from 'zipper';
/**
* Framework debug tools
* @extends debug
* @extends {AbstractModule}
*/
class DebugFrameworkModule extends AbstractModule {
  /** @override */
  async init() {
    const [fw, auth, ui] = await this.app.waitForModule('adaptframework', 'auth', 'ui');
    ui.addUiPlugin(`${this.rootDir}/ui-plugins`);

    fw.apiRouter.addRoute({
      route: '/package',
      handlers: { post: this.handleFrameworkPackage.bind(this) }
    }, {
      route: '/download',
      handlers: { get: this.handleFrameworkDownload.bind(this) }
    }, {
      route: '/purge',
      handlers: { post: this.handleFrameworkPurge.bind(this) }
    }, {
      route: '/clearcache',
      handlers: { post: this.handleClearCache.bind(this) }
    });
    auth.secureRoute(`${fw.apiRouter.path}/package`, 'POST', ['debug'])
    auth.secureRoute(`${fw.apiRouter.path}/download`, 'GET', ['debug'])
    auth.secureRoute(`${fw.apiRouter.path}/purge`, 'POST', ['update:adapt'])
    auth.secureRoute(`${fw.apiRouter.path}/clearcache`, 'POST', ['debug'])
  }

  async handleFrameworkPackage(req, res, next) {
    try {
      this.log('debug', 'Packaging framework files');
      const fw = await this.app.waitForModule('adaptframework')
      const outputDir = path.join(this.app.getConfig('tempDir'), `fw_packaged`)
      await fs.cp(fw.path, outputDir, { recursive: true, filter: p => !p.includes('node_modules') })
      await zipper.zip(outputDir)
      this.log('debug', 'Packaging complete');
      res.sendStatus(200)
    } catch(e) {
      next(e)
    }
  }
  
  async handleFrameworkDownload(req, res, next) {
    try {
      const outputDir = path.join(this.app.getConfig('tempDir'), `fw_packaged`)
      const outputZip = `${outputDir}.zip`
      this.log('info', 'Sending zip file');
      res.sendFile(outputZip)
      await fs.rm(outputDir, { recursive: true })
    } catch(e) {
      next(e)
    }
  }
  
  async handleFrameworkPurge(req, res, next) {
    try {
      const fw = await this.app.waitForModule('adaptframework')
      await fs.rm(fw.path, { recursive: true })
      await fw.installFramework()
      return res.status(200).end()
    } catch(e) {
      next(e)
    }
  }
  
  async handleClearCache(req, res, next) {
    try {
      const fw = await this.app.waitForModule('adaptframework')
      await fs.rm(path.join(fw.getConfig('buildDir'), 'cache'), { recursive: true })
      return res.status(200).end()
    } catch(e) {
      next(e)
    }
  }
}

export default DebugFrameworkModule;
