<script>
import * as yup from "yup";
import { Field, ErrorMessage } from "vee-validate";

export default {
    props: {
        field: { type: String, required: true },
        forWhat: { type: String, required: true },
        value: { type: Object, required: true },
    },
    data() {
        const titleFormSchema = yup.object().shape({
            title: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
        });

        return {
            titleFormSchema
        };
    },
    components: {
        Field,
        ErrorMessage,
    },
    methods: {
        updateTitle() {
            this.$emit('input', {
                title: +this.$refs.title.value,
            });
        }
    }
};
</script>

<template>
    <div class="form-group">
        <label>{{ forWhat }}</label>
        <Field type="text" class="form-control" :name="field" v-model="value[field]" :placeholder="forWhat" ref="title" @input="updateTitle()" />
        <ErrorMessage name="title" class="error-feedback" />
    </div>
</template>