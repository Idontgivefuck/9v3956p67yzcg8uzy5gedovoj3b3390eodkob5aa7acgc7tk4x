<script>
import { defineComponent } from "vue";
import moment from "moment";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
import UploadRealmoji from "./uploadRealmoji.vue";
import Realmoji from "./Realmoji.vue";
import Carousel from "../ui/Carousel.vue";

export default defineComponent({
  props: ["post", "user"],
  data() {
    return {
      curpost: this.post[0],
      reverseGeo: "",
      coordinates: "",
      showModal: false,
      comment: "",
      submitCommentLoading: false,
      hideSecondaryPhoto: false,
      isOwner: false,
      showEmojis: false,
    };
  },
  methods: {
    reverseImages() {
      const temp = this.curpost.primary.url;
      this.curpost.primary.url = this.curpost.secondary.url;
      this.curpost.secondary.url = temp;
    },
    postdate() {
      return moment(this.curpost.creationDate).format("MM-DD-YYYY h:mm:ss");
    },
    cleancomment(s) {
      s = s.replaceAll("<", "&lt;");
      return s.replace(
        /@\w+/g,
        "<span class='font-bold text-blue-200'>$&</span>"
      );
    },
    submitComment() {
      this.submitCommentLoading = true;
      fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/comments?postId=${this.curpost.id}&postUserId=${this.user.id}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: this.comment,
          }),
        }
      )
        .then(() => {
          this.comment = "";
          this.$store.dispatch("getPosts");
          this.submitCommentLoading = false;
        })
        .catch(() => {
          this.submitCommentLoading = false;
          this.comment = "";
          this.$store.commit(
            "error",
            "An error occurred while submitting your comment. Please try again later."
          );
        });
    },
    scrollCarousel(i) {
      this.curpost = this.post[i];
    },
    getReverseGeo() {
      if (this.curpost.location) {
        fetch(
          `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${this.curpost.location.longitude},${this.curpost.location.latitude}&outSR=&forStorage=false&f=pjson`
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.address;
            const city = address.City;
            const province = address.Subregion;
            const country = address.CntryName;

            const formattedAddress = `${address.Address} - ${city} (${province}), ${country}`;
            this.reverseGeo = formattedAddress;
            this.coordinates = `Coordinate esatte: ${this.curpost.location.latitude}, ${this.curpost.location.longitude}`;
          })
          .catch((err) => {
            console.log("error in reverse geocoding");
          });
      }
    },
  },
  computed: {
    color() {
      let letters = "0123456789ABCDEF";
      let color = "";
      for (let i = 0; i < 6; i++) {
        color += letters[this.user.username.charCodeAt(i) % 16];
      }
      return color;
    },
  },
  async beforeMount() {
    if (this.curpost.location) {
      await this.getReverseGeo();
    }
    if (this.$store.state.user.id === this.user.id) {
      this.isOwner = true;
    }
  },
  components: {
    MyButton,
    MyInput,
    UploadRealmoji,
    Realmoji,
    Carousel,
  },
});
</script>

<template>
  <div class="block w-[100%] bg-black rounded-lg shadow-md sm:w-auto border border-white p-3 sm:max-w-fit sm:h-[100%]">
    <div class="flex flex-col">
      <div class="flex items-center sm:justify-center">
        <img
          referrerpolicy="no-referrer"
          v-bind:src="
            user.profilePicture
              ? user.profilePicture.url
              : 'https://ui-avatars.com/api/?length=1' +
                '&name=' +
                user.username +
                '&background=' +
                color
          "
          class="w-12 rounded-[50%] sm:w-32 m-3"
          @error="
            'https://ui-avatars.com/api/?length=1' +
              '&name=' +
              user.username +
              '&background=' +
              color
          "
          alt="profilepic"
          />
        <div class="flex flex-col ml-2">
          <div class="flex items-center">
            <span class="font-bold" style="font-family: 'Nunito', sans-serif;">{{ user.username }}</span>
          </div>
          <div class="flex items-center mt-1">
            <span class="text-xs" style="font-family: 'Nunito', sans-serif;">{{ reverseGeo }}</span>
            <span class="text-xs" v-if="!curpost.location">(Posizione disabilitata)</span>
          </div>
          <div class="flex items-center mt-1">
            <span class="text-xs" style="font-family: 'Nunito', sans-serif;">{{ coordinates }}</span>          
          </div>
        </div>
        <div>
          <img
            class="cursor-pointer h-6 ml-5"
            @click="this.$store.dispatch('deletePost')"
            v-if="isOwner"
            src="../../assets/icons8-trash-can.svg"
            alt="trash"
        />
        </div>
      </div>
      <div class="flex items-center justify-center">
        <Carousel v-if="post.length > 1" :length="post.length" @scroll="scrollCarousel">
          <div
            class="relative flex-shrink-0 snap-start w-[100%] snap-normal"
            v-for="p in post"
          >
            <img
              referrerpolicy="no-referrer"
              v-bind:src="p.primary.url"
              class="relative top-0 left-0 rounded-md w-[400px]"
              @click="hideSecondaryPhoto = !hideSecondaryPhoto"
              alt="postImage"
            />
            <img
              referrerpolicy="no-referrer"
              v-bind:src="p.secondary.url"
              class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
              @click="reverseImages"
              v-if="!hideSecondaryPhoto"
              alt="postImage"
            />
          </div>
        </Carousel>
        <div class="relative top-0 left-0 justify-center" v-else>
          <img
            referrerpolicy="no-referrer"
            v-bind:src="curpost.primary.url"
            class="relative top-0 left-0 rounded-md sm:w-[400px] w-[100%]"
            @click="hideSecondaryPhoto = !hideSecondaryPhoto"
            alt="postImage"
          />
          <img
            referrerpolicy="no-referrer"
            v-bind:src="curpost.secondary.url"
            class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
            @click="reverseImages"
            v-if="!hideSecondaryPhoto"
            alt="postImage"
          />
        </div>
      </div>

      <div class="flex items-center font-bold mt-2 justify-center">
        <span> {{ postdate() }} </span>
        <span class="ml-3">Retakes - {{ curpost.retakeCounter }}</span>
      </div>
      <div class="flex flex-col">
        <span v-if="curpost.caption">
          <span class="font-bold">{{ user.username + ": " }} </span>
          {{ curpost.caption }}
        </span>
      </div>
      <div v-if="curpost.comments" class="flex flex-col sm:w-[500px]">
        <div v-for="c in curpost.comments">
          <span class="font-bold"> {{ c.user.username + ": " }}</span>
          <span v-html="cleancomment(c.content)"></span>
        </div>
      </div>
      <div class="flex gap-3 items-center overflow-auto mt-4">
        <Realmoji :key="e.id" :realmoji="e" v-for="e in curpost.realMojis" />
        <UploadRealmoji
          v-if="!isOwner"
          :postID="curpost.id"
          :postOwnerID="user.id"
          class="ml-4"
/>
      </div>
    </div>
    <div class="flex mb-5">
      <MyInput
        @enterPressed="submitComment"
        v-model="comment"
        placeholder="Commenta"
        typeOfInput="text"
/>
      <MyButton @clickedd="submitComment" :loading="submitCommentLoading">Invia</MyButton>
    </div>
  </div>
</template>