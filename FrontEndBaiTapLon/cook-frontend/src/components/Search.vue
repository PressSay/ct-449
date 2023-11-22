<script>
export default {
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        submitSearch() {
            const recipeSearch = document.querySelector("#recipe-input-search");
            const productSearch = document.querySelector("#product-input-search");
            const radio = $("input[type='radio'][name='forwhat']:checked").val();
            
            if (radio == "recipe") {
                this.window.localStorage.setItem("nameR", recipeSearch.value);
                this.window.location.href = "/recipes";
                // this.console.log("nameR", recipeSearch.value);
            } else if (radio == "product") {
                this.window.localStorage.setItem("nameP", productSearch.value);
                this.window.location.href = "/products";
                // this.console.log("nameP", productSearch.value);
            }
            this.console.log("submitSearch", radio);
        }
    }
}
</script>

<template>
    <div id="search" class="search-wrap">
        <button type="button" class="close"
            onclick='() => {document.querySelector("#search").classList.remove("open")}'>×</button>
        <div class="search-form text-center">
            <!-- <input type="search" id="ooooo" value="" placeholder="Type here........" /> -->
            <div class="d-block">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input id="recipe-search" type="radio" name="forwhat" aria-label="Radio button for following text input" value="recipe">
                            <label for="recipe-search" class="ml-2" style="font-size: large; width: 8rem;">Recipe</label>
                        </div>
                    </div>
                    <input id="recipe-input-search" type="search" class="form-control" aria-label="Text input with radio button">
                </div>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input id="product-search" type="radio" name="forwhat" aria-label="Radio button for following text input" value="product">
                            <label for="product-search" class="ml-2" style="font-size: large; width: 8rem;">Product</label>
                        </div>
                    </div>
                    <input id="product-input-search" type="search" class="form-control" aria-label="Text input with radio button">
                </div>
            </div>
            <button @click="this.submitSearch()"  class="search-btn"><i class="flaticon-search"></i></button>
        </div>
    </div>
</template>
