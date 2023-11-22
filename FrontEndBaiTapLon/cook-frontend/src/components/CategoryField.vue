<script>
export default {
    props: {
        arrCategory: {
            type: Array,
            required: true
        }
    }
}
</script>

<template>
    <div class="form-group">
        <label>Chọn Công Thức</label>
        <select class="select2" name="filter-by">
            <option v-for="(category, index) in arrCategory" :value="category._id" :key="category._id">
            {{ category.name  }}
            </option>
        </select>
    </div>
</template>