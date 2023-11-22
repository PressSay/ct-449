<script>
import AppHeader from './components/AppHeader.vue';
import Footer from './components/Footer.vue';
import Search from './components/Search.vue';
import Modal from './components/Modal.vue';

export default {
    components: {
        AppHeader,
        Footer,
        Search,
        Modal
    },
}
</script>

<template>
    <div id="app">
        <a href="#wrapper" data-type="section-switch" class="scrollup">
            <i class="fas fa-angle-double-up"></i>
        </a>
        <div id="preloader"></div>
        <div id="wrapper" class="wrapper">
            <AppHeader />
            <router-view />
            <Footer />
        </div>
    </div>
    <Search />
    <!-- Login in line 30 -->
    <Modal /> 
</template>
<style></style>