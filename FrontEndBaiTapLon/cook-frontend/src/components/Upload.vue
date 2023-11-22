<script>
import * as yup from "yup";
import { Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Field,
        ErrorMessage,
    },
    data() {
        const uploadFormSchema = yup.object().shape({
            image: yup
                .array()
                .required("Hình ảnh không được để trống.")
        });

        return {
            uploadFormSchema
        };
    },
    props: {
        arrImg: { type: Object, required: true },
    },
    methods: {
        displayImage(input) {
            let ulImage = this.$refs.images;
            ulImage.innerHTML = "";

            if (input.files) {
                for (var key in input.files) {
                    if (key != "item" && key != "length") {
                        let reader = new FileReader();
                        let image = document.createElement("img");
                        let li = document.createElement("li");
                        li.setAttribute("style", "width: 12rem; height: auto;");

                        reader.onload = function (e) {
                            image.setAttribute("src", e.target.result);
                            image.setAttribute("alt", "Upload Image");
                        }

                        reader.readAsDataURL(input.files[key]);
                        li.appendChild(image);

                        ulImage.appendChild(li);
                    }
                };
            }
            
        },
        upImg() {
            this.$emit('input', { files: this.$refs.img.files });
        }
    }
};
</script>

<template>
    <div class="additional-input-wrap">
        <label>Tải Ảnh Lên</label>
        <div class="form-group">
            <ul class="upload-img" ref="images">
                <li><img src="@/assets/img/figure/upload-banner1.jpg" alt="Upload Image"></li>

            </ul>
            <Field id="upload" type="file" name="images[]" multiple @change="displayImage($event.target)"
                style="display: none;" ref="img" v-model="arrImg['files']" @input="upImg()" />
            <label for="upload" type="submit" class="btn-upload"><i class="fas fa-cloud-upload-alt"></i>UPLOAD</label>
            <ErrorMessage name="image" />
        </div>
    </div>
</template>