
<script>
import * as yup from "yup";
import { Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Field,
        ErrorMessage,
    },
    props: {
        arrIngredient: { type: Array, required: true }
    },
    data() {
        yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            quantity: yup
                .string()
                .matches(
                    /.*\d\s.*[a-zA-Z]$/g,
                    "Số lượng không hợp lệ."
                )
        });
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        addIngredient() {
            this.arrIngredient.push({
                name: "",
                quantity: "",
            });
        },
        deleteIngredient(index) {
            if (this.arrIngredient.length == 1) {
                alert("Bạn phải có ít nhất 1 nguyên liệu");
                return;
            }
            this.arrIngredient.splice(index, 1);
        },
        handleName(index) {
            const ele = this.window.document.getElementById('ingre-name-' + index);
            this.arrIngredient[index - 1]['name'] = ele.value;
            this.console.log(this.arrIngredient[index - 1]['name']);
        },
        handIngre(index) {
            const ele = this.window.document.getElementById('ingre-quantity-' + index);
            this.arrIngredient[index - 1]['quantity'] = ele.value;
            this.console.log(this.arrIngredient[index - 1]['quantity']);
        }
    }
};
</script>
<template>
    <div class="additional-input-wrap">
        <label>Nguyên Liệu:</label>
        <div v-for="index in arrIngredient.length" class="row gutters-5">
            <div class="col-6">
                <div class="form-group additional-input-box icon-left">
                    <Field :id="'ingre-name-' + index" :name="'ingredient-' + index" type="text" class="form-control"
                        placeholder="name" @input="handleName(index)" />
                </div>
                <ErrorMessage :name="'ingredient-' + index" class="error-feedback" />
            </div>
            <div class="col-6">
                <div class="form-group additional-input-box icon-right">
                    <Field :id="'ingre-quantity-' + index" :name="'quantity-' + index" type="text" class="form-control"
                        placeholder="quantity" @input="handIngre(index)" />
                    <i class="fas fa-times" @click="deleteIngredient(index - 1)"></i>
                </div>
                <ErrorMessage :name="'quantity-' + index" class="error-feedback" />
            </div>
        </div>

        <div @click="addIngredient()" class="btn-upload"><i class="flaticon-add-plus-button"></i>ADD NEW
            INGREDIENT</div>
    </div>
</template>