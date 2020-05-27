import Base from '../Base'
import CouncilService from '../../service/CouncilService'

export default class extends Base {
    async action() {
        const service = this.buildService(CouncilService)

        const rs = await service.eachCouncilJob()
        return this.result(1, rs)
    }
}