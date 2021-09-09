import { merge } from 'webpack-merge'
import { GetDevopsDomain } from '../tools'
import produ from './produ'

export default merge(produ, {
    NODE_ENV: '"development"',
    DEVOPS_DOMAIN: JSON.stringify(GetDevopsDomain())
})
