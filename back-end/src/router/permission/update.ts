import Base from '../Base'
import Service from '../../service/PermissionService'

export default class extends Base {
  protected needLogin = true

  public async action() {
    const service = this.buildService(Service)
    const param = this.getParam()

    const result = await service.update(param)

    return this.result(1, result)
  }
}
