<template>
 <div>
        <home-hero/>
        <Middle id='easy'/>
        <Bottom/>
        <Contact/>
        <Footer/>
    </div>
</template>

<script>
import HomeHero from '@/components/home/HomeHero'
import Middle from '@/components/home/Middle'
import Bottom from '@/components/home/Bottom'
import Contact from '@/components/home/Contact'
import Footer from '@/components/home/Footer'

export default {
    name: 'Home',
    components: { HomeHero, Middle, Bottom, Contact, Footer },
    
}
</script>

<style>
</style>
