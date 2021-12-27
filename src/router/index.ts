import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Response from '@/views/Response.vue'
import Thanks from '@/views/Thanks.vue'


const routes = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/respond/:guestId',
    name: 'response',
    component: Response, 
    props: true,
}, {
    path: '/thanks/:guestId',
    name: 'thanks',
    component: Thanks,
    props: route => ({ ...route.query, ...route.params })
}]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
