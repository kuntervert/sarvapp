import Vue from 'vue';
import VueRouter from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'HelloWorld',
		component: HelloWorld
	},
	{
		path: '/detail:id',
		name: 'DetailView',
		component: () => import('../views/DetailView.vue')
	}
];

const router = new VueRouter({
	routes
});

export default router;
