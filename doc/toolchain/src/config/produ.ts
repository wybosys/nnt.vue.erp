import { GetDevopsDomain } from "../tools";

export default {
    NODE_ENV: '"production"',
    DEVOPS_DOMAIN: JSON.stringify(GetDevopsDomain())
}
