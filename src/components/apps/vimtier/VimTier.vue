<template>
  <div class="flex w-screen">
    <!-- Commands List -->
    <div class="p-4">
      <h3 class="text-2xl font-bold ">COMMANDS</h3>
      <ul class="grid gap-1">
        <li>
          <button class="px-2 py-[1px] rounded-md bg-ew-mrt hover:bg-ew-mrt/50 flex gap-1" v-on:click="handleCopy">
            <svg class="my-auto dark:invert" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/>
              <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/>
              </svg>
              Copy</button>
        </li>
        <li>
          <button class="px-2 py-[1px] rounded-md bg-hp-mrt hover:bg-hp-mrt/50 flex gap-1" v-on:click="handleUpload">
            <svg class="my-auto dark:invert" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Upload</button>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">n</kbd>
          &nbsp;
          <span>New Item</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">i</kbd>
          &nbsp;
          <span>Insert Mode</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">e</kbd>
          &nbsp;
          <span>Edit Mode</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">v</kbd>
          &nbsp;
          <span>View Mode</span>
        </li>
        <li>
          <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z"/>
            </svg>
            <span class="sr-only">Arrow key up</span>
          </kbd>
          &nbsp;
          <span>Navigate Up</span> 
        </li>
        <li>
          <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"/>
            </svg>
            <span class="sr-only">Arrow key down</span>
          </kbd>
          &nbsp;
          <span>Navigate Down</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
            </svg>
            <span class="sr-only">Arrow key left</span>
          </kbd>
          &nbsp;
          <span>Navigate Left</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
            </svg>
            <span class="sr-only">Arrow key right</span>
          </kbd>
          &nbsp;
          <span>Navigate Right</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z"/>
            </svg>
            <span class="sr-only">Arrow key up</span>
          </kbd>
          &nbsp;
          <span>Move Up</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"/>
            </svg>
            <span class="sr-only">Arrow key down</span>
          </kbd>
          &nbsp;
          <span>Move Down</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
            </svg>
            <span class="sr-only">Arrow key left</span>
          </kbd>
          &nbsp;
          <span>Move Left</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
            </svg>
            <span class="sr-only">Arrow key right</span>
          </kbd>
          &nbsp;
          <span>Move Right</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">s</kbd>
          &nbsp;
          <span>Place in S</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">a</kbd>
          &nbsp;
          <span>Place in A</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">b</kbd>
          &nbsp;
          <span>Place in B</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">c</kbd>
          &nbsp;
          <span>Place in C</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">d</kbd>
          &nbsp;
          <span>Place in D</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">f</kbd>
          &nbsp;
          <span>Place in F</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">backspace</kbd>
          &nbsp;
          <span>Remove Item</span>
        </li>
      </ul>
    </div>

    <!-- Next List -->
    <div class="p-4">
      <h3 class="text-2xl font-bold">INSERT</h3>
      <draggable
        class="list-group grid"
        :list="items"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        group="items"
        @start="drag = true"
        @end="drag = false"
        @change="pendingLog"
        itemKey="name"
      >
        <template #item="{ element, index }" class="">
          <div class="px-1 py-0 rounded-md my-1 text-white me-auto text-center" :class="{
            'bg-ew-500': mode === 'insert' && cursorZ === index,
            'bg-ns-500/70': mode === 'edit' || (mode === 'insert' && cursorZ !== index),
            [colors[index % colors.length]]: mode === 'view'
          }">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>

    <!-- Tier List -->
    <div class="p-4">
      <h3 class="text-2xl font-bold">TIER LIST</h3>
      <div v-for="(tier, tierIndex) in tiers" class="border-[1px] my-2 border-dt-300/50 rounded-md p-2">
        <h3 class="text-lg">{{ tierNames[tierIndex] }}</h3>
        <draggable
          class="list-group flex flex-wrap gap-1"
          :list="tier"
          :component-data="{
            tag: 'ul',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          group="items"
          @change="editLog"
          @start="drag = true"
          @end="drag = false"
          itemKey="name"
        >
          <template #item="{ element, index }" class="">
            <div class="px-1 py-0 rounded-md text-white"
              :class="{
                'bg-ew-500': mode === 'edit' && bufferedX === index && cursorY === tierIndex,
                'bg-ns-500/70': mode === 'insert' || ((bufferedX !== index || cursorY !== tierIndex) && mode === 'edit'),
                [colors[index % colors.length]]: mode === 'view'
              }">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Swal from 'sweetalert2';

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable
  },
  created() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  },
  data() {
    return {
      colors: [
        'bg-ew-mrt', 'bg-ns-mrt', 'bg-ne-mrt', 'bg-cc-mrt', 'bg-dt-mrt',
        'bg-te-mrt', 'bg-jr-mrt', 'bg-cr-mrt', 'bg-sl-mrt'
      ],
      tiers: [
        [],
        [],
        [],
        [],
        [],
        []
      ],
      tierNames: [
        "S",
        "A",
        "B",
        "C",
        "D",
        "F"
      ],
      items: [
      ],
      mode: "insert",
      currId: 0,
      cursorX: 0,
      cursorY: 0,
      cursorZ: 0,
      cursorId: 0,
      pressed: new Set(),
      drag: false
    };
  },
  computed: {
    bufferedX() {
      return Math.min(this.cursorX, this.tiers[this.cursorY].length - 1);
    },
  },
  methods: {
    editLog: function(evt) {
      let changedId = -1;
      if (evt.added) {
        changedId = evt.added.element.id;
      } else if (evt.moved) {
        changedId = evt.moved.element.id;
      } else {
        return;
      }

      // update cursorX and cursorY
      for (let y = 0; y < this.tiers.length; y++) {
        for (let x = 0; x < this.tiers[y].length; x++) {
          if (this.tiers[y][x].id === changedId) {
            this.cursorX = x;
            this.cursorY = y;
            this.cursorId = changedId;
            return;
          }
        }
      }
    },
    pendingLog: function(evt) {
      let changedId = -1;
      if (evt.added) {
        changedId = evt.added.element.id;
      } else if (evt.moved) {
        changedId = evt.moved.element.id;
      } else {
        return;
      }

      // update cursorZ
      for (let z = 0; z < this.items.length; z++) {
        if (this.items[z].id === changedId) {
          this.cursorZ = z;
          return;
        }
      }
    },
    onKeyUp: function(evt) {
      if (!evt) return;

      this.pressed.delete(evt.key);
    },
    onKeyDown: function(evt) {
      if (!evt) return;

      this.pressed.add(evt.key);

      if (this.pressed.has("i")) {
        this.mode = "insert";
        return;
      }

      if (this.pressed.has("e")) {
        this.mode = "edit";
        return;
      }

      if (this.pressed.has("v")) {
        this.mode = "view";
        return;
      }

      if (this.pressed.has("n")) {
        Swal.fire({
          title: 'New Item',
          input: 'text'
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            // push to the front
            this.items.unshift({ name: result.value, id: this.items.length + 1 });
            this.cursorZ = Math.max(this.cursorZ, 0);
          }
        })
        return;
      }

      if (this.mode === "insert") {
        this.handleInsertMode(evt.key);
        return
      }

      if (this.mode === "edit") {
        this.handleEditMode();
      }
    },
    handleInsertMode(key) {
      // handle empty list
      if (!this.items.length) return;

      if (this.pressed.has("Backspace") || this.pressed.has("Delete")) {
        if (this.items.length === 0) return;
        const temp = this.items[this.cursorZ];
        this.items.splice(this.cursorZ, 1);
        this.cursorZ = Math.min(this.cursorZ, this.items.length - 1);
        return;
      }

      if (this.pressed.has("m") && this.pressed.has("ArrowUp")) {
        this.handlePendingUpgrade();
        return;
      }

      if (this.pressed.has("m") && this.pressed.has("ArrowDown")) {
        this.handlePendingDowngrade();
        return;
      }

      if (this.pressed.has("ArrowUp")) {
        this.handlePendingUp();
        return;
      }

      if (this.pressed.has("ArrowDown")) {
        this.handlePendingDown();
        return;
      }

      // add to tier

      for (let [i, x] of this.tierNames.entries()) {
        if (key === x.toLowerCase()) {
          this.tiers[i].push(this.items[this.cursorZ]);
          // pop
          this.items.splice(this.cursorZ, 1);
          this.cursorZ = Math.min(this.cursorZ, this.items.length - 1);
          return;
        }
      }

    },
    rectifyEditMode() {
      while (this.cursorY > 0 && this.tiers[this.cursorY].length === 0) {
        this.cursorY--;
      }

      while (this.cursorY < this.tiers.length - 1 && this.tiers[this.cursorY].length === 0) {
        this.cursorY++;
      }
    },
    handleEditMode() {
      this.rectifyEditMode();

      if (this.pressed.has("Backspace") || this.pressed.has("Delete")) {
        if (this.tiers[this.cursorY].length === 0) return;
        const temp = this.tiers[this.cursorY][this.bufferedX];
        this.tiers[this.cursorY].splice(this.bufferedX, 1);
        this.items.push(temp);
        this.rectifyEditMode();
        return;
      }

      if (this.pressed.has("m") && this.pressed.has("ArrowRight")) {
        this.handleSwapRight();
        return;
      }

      if (this.pressed.has("m") && this.pressed.has("ArrowLeft")) {
        this.handleSwapLeft();
        return;
      }

      if (this.pressed.has("m") && this.pressed.has("ArrowUp")) {
        this.handleUpgrade();
        return;
      }

      if (this.pressed.has("m") && this.pressed.has("ArrowDown")) {
        this.handleDowngrade();
        return;
      }
  
      if (this.pressed.has("ArrowRight")) {
        this.handleNavigateRight();
        return;
      }

      if (this.pressed.has("ArrowLeft")) {
        this.handleNavigateLeft();
        return;
      }

      if (this.pressed.has("ArrowUp")) {
        this.handleNavigateUp();
        return;
      }

      if (this.pressed.has("ArrowDown")) {
        this.handleNavigateDown();
        return;
      }
    },
    handleNavigateRight() {
      if (this.bufferedX < this.tiers[this.cursorY].length - 1) {
        this.cursorX = this.bufferedX + 1;
        this.cursorId = this.tiers[this.cursorY][this.cursorX].id;
        return;
      }

      let checks = 0;
      while (true) {
        if (this.cursorY < this.tiers.length - 1) {
          this.cursorX = 0;
          this.cursorY++;
        } else {
          this.cursorX = 0;
          this.cursorY = 0;
        }

        checks++;

        if (this.tiers[this.cursorY].length > 0 || checks > this.tiers.length) {
          break;
        }
      }

      this.cursorId = this.tiers[this.cursorY][this.cursorX].id;
    },
    handleNavigateLeft() {
      if (this.cursorX > 0) {
        this.cursorX = this.bufferedX - 1;
        this.cursorId = this.tiers[this.cursorY][this.cursorX].id;
        return;
      }

      let checks = 0;
      while (true) {
        if (this.cursorY > 0) {
          this.cursorX = this.tiers[this.cursorY - 1].length - 1;
          this.cursorY--;
        } else {
          this.cursorX = this.tiers[this.tiers.length - 1].length - 1;
          this.cursorY = this.tiers.length - 1;
        }

        checks++;

        if (this.tiers[this.cursorY].length > 0 || checks > this.tiers.length) {
          break;
        }
      }

      this.cursorId = this.tiers[this.cursorY][this.cursorX].id;
    },
    handleNavigateUp() {
      let checks = 0;
      while (true) {
        if (this.cursorY > 0) {
          this.cursorY--;
        } else {
          this.cursorY = this.tiers.length - 1;
        }

        checks++;

        if (this.tiers[this.cursorY].length > 0 || checks > this.tiers.length) {
          break;
        }
      }

      this.cursorId = this.tiers[this.cursorY][this.bufferedX].id;d
    },
    handleNavigateDown() {
      let checks = 0;
      while (true) {
        if (this.cursorY < this.tiers.length - 1) {
          this.cursorY++;
        } else {
          this.cursorY = 0;
        }

        checks++;

        if (this.tiers[this.cursorY].length > 0 || checks > this.tiers.length) {
          break;
        }
      }

      this.cursorId = this.tiers[this.cursorY][this.bufferedX].id;
    },
    handlePendingUp() {
      console.log(this.cursorZ);
      if (this.cursorZ > 0) {
        this.cursorZ--;
      } else {
        this.cursorZ = this.items.length - 1;
      }
    },
    handlePendingDown() {
      if (this.cursorZ < this.items.length - 1) {
        this.cursorZ++;
      } else {
        this.cursorZ = 0;
      }
    },
    handleSwapRight() {
      this.cursorX = this.bufferedX;
      if (this.cursorX === this.tiers[this.cursorY].length - 1 && this.cursorY === this.tiers.length - 1) return;

      if (this.cursorX < this.tiers[this.cursorY].length - 1) {
        // swap with next item
        const temp = this.tiers[this.cursorY][this.cursorX];
        this.tiers[this.cursorY][this.cursorX] = this.tiers[this.cursorY][this.cursorX + 1];
        this.tiers[this.cursorY][this.cursorX + 1] = temp;
      } else if (this.cursorY < this.tiers.length - 1) {
        // swap with next list
        const temp = this.tiers[this.cursorY][this.cursorX];
        this.tiers[this.cursorY].splice(this.cursorX, 1);
        this.tiers[this.cursorY + 1].push(temp);
      }

      this.handleNavigateRight();
    },
    handleSwapLeft() {
      this.cursorX = this.bufferedX;
      if (this.cursorX === 0 && this.cursorY === 0) return;

      if (this.cursorX > 0) {
        // swap with previous item
        const temp = this.tiers[this.cursorY][this.cursorX];
        this.tiers[this.cursorY][this.cursorX] = this.tiers[this.cursorY][this.cursorX - 1];
        this.tiers[this.cursorY][this.cursorX - 1] = temp;
      } else if (this.cursorY > 0) {
        // swap with previous list
        const temp = this.tiers[this.cursorY][this.cursorX];
        this.tiers[this.cursorY].splice(this.cursorX, 1);
        this.tiers[this.cursorY - 1].push(temp);
      }

      this.handleNavigateLeft();
    },
    handleUpgrade() {
      this.cursorX = this.bufferedX;
      if (this.cursorY > 0) {
        const temp = this.tiers[this.cursorY][this.cursorX];
        this.tiers[this.cursorY].splice(this.cursorX, 1);
        // insert at same position in previous list
        this.tiers[this.cursorY - 1].splice(this.cursorX, 0, temp);
        this.cursorY--;
      }

      this.cursorId = this.tiers[this.cursorY][this.bufferedX].id;
    },
    handleDowngrade() {
      this.cursorX = this.bufferedX;
      if (this.cursorY < this.tiers.length - 1) {
        const temp = this.tiers[this.cursorY][this.cursorX];
        this.tiers[this.cursorY].splice(this.cursorX, 1);
        // insert at same position in next list
        this.tiers[this.cursorY + 1].splice(this.cursorX, 0, temp);
        this.cursorY++;
      }

      this.cursorId = this.tiers[this.cursorY][this.bufferedX].id;
    },
    handlePendingUpgrade() {
      if (this.cursorZ > 0) {
        const temp = this.items[this.cursorZ];
        this.items.splice(this.cursorZ, 1);
        this.items.splice(this.cursorZ - 1, 0, temp);
        this.cursorZ--;
      }
    },
    handlePendingDowngrade() {
      if (this.cursorZ < this.items.length - 1) {
        const temp = this.items[this.cursorZ];
        this.items.splice(this.cursorZ, 1);
        this.items.splice(this.cursorZ + 1, 0, temp);
        this.cursorZ++;
      }
    },
    handleCopy() {
      // copies tiers as json string
      navigator.clipboard.writeText(JSON.stringify({
        items: this.items.map(item => item.name),
        tiers: this.tiers.map(tier => tier.map(item => item.name))
      }));
      Swal.fire({
        title: 'Copied!',
        text: 'Tiers copied to clipboard',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    },
    handleUpload() {
      // uploads tiers from json string
      Swal.fire({
        title: 'Upload Tiers',
        input: 'textarea',
        inputPlaceholder: 'Paste tiers here',
        inputValue: '{"items":[],"tiers":[[],[],[],[],[],[]]}',
        showCancelButton: true,
        confirmButtonText: 'Upload',
        showLoaderOnConfirm: true,
        preConfirm: (json) => {
          const parsed = JSON.parse(json);
          try {
            this.items = parsed.items.map((name, id) => ({ name, id: id + 1 }));
            this.tiers = parsed.tiers.map(tier => tier.map((name, id) => ({ name, id: id + 1 })));
          } catch (e) {
            Swal.showValidationMessage(`Invalid JSON: ${e}`);
          }
        }
      });
    }
  },
};
</script>