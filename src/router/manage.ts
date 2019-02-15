const _ = () => import("../sites/manage/Manage.vue")
const _chartusesample = () => import("../sites/manage/ChartUseSample.vue")
const _home = () => import("../sites/manage/Home.vue")
const _maincontent = () => import("../sites/manage/MainContent.vue")
const _manage = () => import("../sites/manage/Manage.vue")
const _mchart = () => import("../nnt/components/MChart.vue")
const _mmessagebox = () => import("../sites/manage/MMessageBox.vue")
const _mtable = () => import("../nnt/components/MTable.vue")
const _tableusesample = () => import("../sites/manage/TableUseSample.vue")

export default [
	{
		path: '/',
		component: _,
		name: '_'
	},
	{
		path: '/chartusesample',
		component: _chartusesample,
		name: '_chartusesample'
	},
	{
		path: '/home',
		component: _home,
		name: '_home'
	},
	{
		path: '/maincontent',
		component: _maincontent,
		name: '_maincontent'
	},
	{
		path: '/manage',
		component: _manage,
		name: '_manage'
	},
	{
		path: '/mchart',
		component: _mchart,
		name: '_mchart'
	},
	{
		path: '/mmessagebox',
		component: _mmessagebox,
		name: '_mmessagebox'
	},
	{
		path: '/mtable',
		component: _mtable,
		name: '_mtable'
	},
	{
		path: '/tableusesample',
		component: _tableusesample,
		name: '_tableusesample'
	}
]
