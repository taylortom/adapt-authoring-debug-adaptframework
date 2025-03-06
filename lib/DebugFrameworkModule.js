import { AbstractModule } from 'adapt-authoring-core';
import fs from 'fs/promises';
import path from 'path';
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
      route: '/download',
      handlers: { post: this.handleFrameworkDownload.bind(this) }
    }, {
      route: '/purge',
      handlers: { post: this.handleFrameworkPurge.bind(this) }
    }, {
      route: '/clearcache',
      handlers: { post: this.handleClearCache.bind(this) }
    });
    auth.secureRoute(`${fw.apiRouter.path}/download`, 'POST', ['debug'])
    auth.secureRoute(`${fw.apiRouter.path}/purge`, 'POST', ['update:adapt'])
    auth.secureRoute(`${fw.apiRouter.path}/clearcache`, 'POST', ['debug'])
  }

  async handleFrameworkDownloader(req, res, next) {
    try {
      const fw = await this.app.waitForModule('adaptframework')
      const outputDir = path.join(this.app.getConfig('tempDir'), `fw_${fw.version}`)
      await fs.cp(fw.path, outputDir, { filter: p => !p.includes('node_modules') })
      return res.sendFile(await zipper.zip(outputDir, { removeSource: true }))
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
