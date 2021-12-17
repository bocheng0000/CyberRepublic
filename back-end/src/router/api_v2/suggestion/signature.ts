import Base from '../../Base'
import SuggestionApiService from '../../../service/SuggestionApiService'

export default class extends Base {
  protected needLogin = false

  async action() {
    const param = this.getParam()
    const service = this.buildService(SuggestionApiService)
    const rs = await service.signature(param)
    return this.result(1, rs)
  }
}
