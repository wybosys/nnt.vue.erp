const _manage = () => import("../components/manage/Manage.vue")
const _ = () => import("../components/manage/Manage.vue")
const _manage_base_base = () => import("../components/manage/base/Base.vue")
const _manage_base_msgbox_mmessagebox = () => import("../components/manage/base/msgbox/MMessageBox.vue")
const _chart = () => import("../components/manage/chart/Chart.vue")
const _chart_chart = () => import("../components/manage/chart/Chart.vue")
const _chart_sample = () => import("../components/manage/chart/sample/Sample.vue")
const _chart_sample_sample = () => import("../components/manage/chart/sample/Sample.vue")
const _manage_home = () => import("../components/manage/Home.vue")
const _manage_maincontent = () => import("../components/manage/MainContent.vue")
const _manage_manage = () => import("../components/manage/Manage.vue")
const _table = () => import("../components/manage/table/Table.vue")
const _table_sample = () => import("../components/manage/table/sample/Sample.vue")
const _table_sample_sample = () => import("../components/manage/table/sample/Sample.vue")
const _table_table = () => import("../components/manage/table/Table.vue")
const _sample_audiorecorder = () => import("../components/sample/AudioRecorder.vue")
const _sample_echo = () => import("../components/sample/Echo.vue")
const _sample_helloworld = () => import("../components/sample/HelloWorld.vue")
const _sample_sample = () => import("../components/sample/Sample.vue")
const _test_test = () => import("../components/test/Test.vue")

export default {
	routes: [
		{
			path: '/manage',
			component: _manage,
			name: '_manage',
			module: true,
			priority: 9999,
			label: 'Manage'
		},
		{
			path: '/',
			component: _,
			name: '_'
		},
		{
			path: '/manage/base/base',
			component: _manage_base_base,
			name: '_manage_base_base'
		},
		{
			path: '/manage/base/msgbox/mmessagebox',
			component: _manage_base_msgbox_mmessagebox,
			name: '_manage_base_msgbox_mmessagebox'
		},
		{
			path: '/chart',
			component: _chart,
			name: '_chart',
			module: true,
			priority: 2,
			label: '图表'
		},
		{
			path: '/chart/chart',
			component: _chart_chart,
			name: '_chart_chart'
		},
		{
			path: '/chart/sample',
			component: _chart_sample,
			name: '_chart_sample',
			module: true,
			priority: 0,
			label: '简单'
		},
		{
			path: '/chart/sample/sample',
			component: _chart_sample_sample,
			name: '_chart_sample_sample'
		},
		{
			path: '/manage/home',
			component: _manage_home,
			name: '_manage_home'
		},
		{
			path: '/manage/maincontent',
			component: _manage_maincontent,
			name: '_manage_maincontent'
		},
		{
			path: '/manage/manage',
			component: _manage_manage,
			name: '_manage_manage'
		},
		{
			path: '/table',
			component: _table,
			name: '_table',
			module: true,
			priority: 1,
			label: '表格'
		},
		{
			path: '/table/sample',
			component: _table_sample,
			name: '_table_sample',
			module: true,
			priority: 0,
			label: '简单'
		},
		{
			path: '/table/sample/sample',
			component: _table_sample_sample,
			name: '_table_sample_sample'
		},
		{
			path: '/table/table',
			component: _table_table,
			name: '_table_table'
		},
		{
			path: '/sample/audiorecorder',
			component: _sample_audiorecorder,
			name: '_sample_audiorecorder'
		},
		{
			path: '/sample/echo',
			component: _sample_echo,
			name: '_sample_echo'
		},
		{
			path: '/sample/helloworld',
			component: _sample_helloworld,
			name: '_sample_helloworld'
		},
		{
			path: '/sample/sample',
			component: _sample_sample,
			name: '_sample_sample'
		},
		{
			path: '/test/test',
			component: _test_test,
			name: '_test_test'
		}]
}
