<script lang="ts" setup>
import { useGlobalStore } from '../../stores/global';
const store = useGlobalStore();

const progress = store.progress

</script>


<template>
    <a-layout>
        <a-layout-header class="my-header">{{ progress }}</a-layout-header>
        <a-layout>
            <a-layout-content class="my-content">Content</a-layout-content>
            <a-layout-sider class="my-sider">
                <a-button type="primary" href="/">
                    Close
                </a-button>
                <a-button type="primary">
                    Clander
                </a-button>
            </a-layout-sider>
        </a-layout>
        <a-layout-footer class="my-footer">Footer</a-layout-footer>
    </a-layout>
</template>

<style scoped lang="less">
.my-header {
    background-color: yellow;
    height: 15vh;
    width: 60vw;
}

.my-content {
    height: 55vh;
    width: 50vw;
}

.my-sider {
    height: 55vh;
    width: 10vw;
}

.my-footer {
    height: 15vh;
    width: 60vw;
}
</style>
