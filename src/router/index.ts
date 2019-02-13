const _ = () => import("../nnt/Site.vue")
const manage = () => import("./manage")
const sample = () => import("./sample")

export default {
	routes: [
		{
			path: '/',
			component: _,
			name: '_site_'
		},
		{
			path: '/:site',
			component: _,
			name: '_site__'
		},
		{
			path: '*',
			component: _,
			name: '_any_'
		}
	],
	sites: {
		manage: manage,
		sample: sample,
		default: manage
	}
}