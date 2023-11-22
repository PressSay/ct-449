<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    props: {
        value: { type: Object, required: true }
    },
    methods: {
        updateInfo() {
            this.$emit('input', {
                preparation: +this.$refs.preparation.value,
                cooking: +this.$refs.cooking.value,
                serving: +this.$refs.serving.value,
                views: +this.$refs.views.value,
            });
        }
    }
}
</script>

<template>
    <div class="additional-input-wrap">
        <label>Thông bổ sung:</label>
        <div class="row gutters-5">
            <div class="col-lg-6">
                <div class="form-group additional-input-box icon-left">
                    <i class="far fa-clock"></i>
                    <Field name="preparation" ref="preparation" type="text" class="form-control"
                        placeholder="Preparation Time: 00.00.00" v-model="value['preparation']" @input="updateInfo()" />
                </div>
                <ErrorMessage name="preparation" class="error-feedback" />
            </div>
            <div class="col-lg-6">
                <div class="form-group additional-input-box icon-left">
                    <i class="fas fa-utensils"></i>
                    <Field name="cooking" ref="cooking" type="text" class="form-control"
                        placeholder="Cooking Time: 00.00.00" v-model="value['cooking']" @input="updateInfo()" />
                </div>
                <ErrorMessage name="cooking" class="error-feedback" />
            </div>
            <div class="col-lg-6">
                <div class="form-group additional-input-box icon-left">
                    <i class="fas fa-users"></i>
                    <Field name="serving" ref="serving" type="text" class="form-control" placeholder="Serving: 00"
                        v-model="value['serving']" @input="updateInfo()" />
                </div>
                <ErrorMessage name="serving" class="error-feedback" />
            </div>
            <div class="col-lg-6">
                <div class="form-group additional-input-box icon-left">
                    <i class="fas fa-eye"></i>
                    <Field name="views" ref="views" type="text" class="form-control" placeholder="Views: 00"
                        v-model="value['views']" @input="updateInfo()" />
                </div>
                <ErrorMessage name="views" class="error-feedback" />
            </div>
        </div>
    </div>
</template>