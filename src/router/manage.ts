const _ = () => import("../sites/manage/Manage.vue")
const _caside = () => import("../sites/manage/CAside.vue")
const _chartusesample = () => import("../sites/manage/ChartUseSample.vue")
const _home = () => import("../sites/manage/Home.vue")
const _manage = () => import("../sites/manage/Manage.vue")
const _mchart = () => import("../sites/manage/MChart.vue")
const _mtable = () => import("../sites/manage/MTable.vue")
const _tableusesample = () => import("../sites/manage/TableUseSample.vue")

export default [
	{
		path: '/',
		component: _,
		name: '_'
	},
	{
		path: '/caside',
		component: _caside,
		name: '_caside'
	},
	{
		path: '/chartusesample',
		component: _chartusesample,
		name: '_chartusesample'
	},
	{
		path: '/home',
		component: _home,
		name: '_home',
    children:[
      {
        path: 'tableusesample',
        component: _tableusesample,
        name: '_tableusesample'
      },
      {
        path: 'chartusesample',
        component: _chartusesample,
        name: '_chartusesample'
      }
    ]
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
