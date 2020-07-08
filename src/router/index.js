import Vue from 'vue';
import VueRouter from 'vue-router';
import Homepage from '../components/Homepage.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Homepage',
		component: Homepage
	},
	{
		path: '/detail/:id',
		name: 'DetailView',
		component: () => import('../views/DetailView.vue')
	}
];

const router = new VueRouter({
	routes
});

export default router;
