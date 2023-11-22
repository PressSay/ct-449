<script>
import * as yup from "yup";
import { Field, ErrorMessage } from "vee-validate";


export default {
    components: {
        Field,
        ErrorMessage,
    },
    props: {
        arrNutrition: { type: Array, required: true }
    },
    data() {
        yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            unit: yup
                .string()
                .matches(
                    /^\d/g,
                    "Số lượng không hợp lệ."
                )
        });
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        addNutrition() {
            this.arrNutrition.push({
                name: "",
                unit: "",
            });

            this.console.log(this.arrNutrition);
        },
        deleteNutrition(index) {
            this.console.log(this.arrNutrition[index]);
            if (this.arrNutrition.length == 1) {
                alert("Bạn phải có ít nhất 1 giá trị dinh dưỡng");
                return;
            }
            this.arrNutrition.splice(index, 1);
        },
        handleName(index) {
            const ele = this.window.document.getElementById('nutr-name-' + index);
            this.arrNutrition[index - 1]['name'] = ele.value;
            this.console.log(this.arrNutrition[index - 1]['name']);
        },
        handUnit(index) {
            const ele = this.window.document.getElementById('nutr-unit-' + index);
            this.arrNutrition[index - 1]['unit'] = ele.value;
            this.console.log(this.arrNutrition[index - 1]['unit']);
        }
    }
};
</script>

<template>
    <div class="additional-input-wrap">
        <label>Giá trị dinh dưỡng:</label>
        <div v-for="index in arrNutrition.length" class="row gutters-5">
            <div class="col-6">
                <div class="form-group additional-input-box icon-left">
                    <Field :id="'nutr-name-' + index" :name="'nutrition-' + index" type="text" class="form-control"
                        placeholder="name" @input="handleName(index)" />
                </div>
                <ErrorMessage :name="'nutrition-'+index" class="error-feedback" />
            </div>
            <div class="col-6">
                <div class="form-group additional-input-box icon-right">
                    <Field :id="'nutr-unit-' + index" :name="'unit-' + index" type="text" class="form-control"
                        placeholder="unit" @input="handUnit(index)" />
                    <i class="fas fa-times" @click="deleteNutrition(index - 1)"></i>
                </div>
                <ErrorMessage :name="'unit-'+index" class="error-feedback" />
            </div>
        </div>

        <div @click="addNutrition()" class="btn-upload"><i class="flaticon-add-plus-button"></i>ADD NEW
            Nutrition</div>
    </div>
</template>