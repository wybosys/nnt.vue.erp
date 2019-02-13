const _ = () => import("../sites/sample/Sample.vue")
const _audiorecorder = () => import("../sites/sample/AudioRecorder.vue")
const _echo = () => import("../sites/sample/Echo.vue")
const _helloworld = () => import("../sites/sample/HelloWorld.vue")
const _sample = () => import("../sites/sample/Sample.vue")

export default [
	{
		path: '/',
		component: _,
		name: '_'
	},
	{
		path: '/audiorecorder',
		component: _audiorecorder,
		name: '_audiorecorder'
	},
	{
		path: '/echo',
		component: _echo,
		name: '_echo'
	},
	{
		path: '/helloworld',
		component: _helloworld,
		name: '_helloworld'
	},
	{
		path: '/sample',
		component: _sample,
		name: '_sample'
	}
]
