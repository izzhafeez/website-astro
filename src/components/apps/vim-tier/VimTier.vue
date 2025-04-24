<template>
  <div class="flex w-screen">
    <!-- Commands List -->
    <div class="p-4">
      <h3 class="text-2xl font-bold ">COMMANDS</h3>
      <ul class="grid gap-1">
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">p</kbd>
          &nbsp;
          <span>Copy Tier List</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">u</kbd>
          &nbsp;
          <span>Upload Tier List</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">n</kbd>
          &nbsp;
          <span>New Item</span>
        </li>
        <li>
          <kbd
            class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 border border-gray-200 rounded-lg dark:text-gray-100 dark:border-gray-500"
            :class="{
              'bg-white dark:bg-gray-600': mode !== 'insert',
              'bg-ew-500': mode === 'insert'
            }">i</kbd>
          &nbsp;
          <span>Insert Mode</span>
        </li>
        <li>
          <kbd
            class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 border border-gray-200 rounded-lg dark:text-gray-100 dark:border-gray-500"
            :class="{
              'bg-white dark:bg-gray-600': mode !== 'edit',
              'bg-ew-500': mode === 'edit'
            }">e</kbd>
          &nbsp;
          <span>Edit Mode</span>
        </li>
        <li>
          <kbd
            class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 border border-gray-200 rounded-lg dark:text-gray-100 dark:border-gray-500"
            :class="{
              'bg-white dark:bg-gray-600': mode !== 'view',
              'bg-ew-500': mode === 'view'
            }">v</kbd>
          &nbsp;
          <span>View Mode</span>
        </li>
        <li>
          <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z"/>
            </svg>
            <span class="sr-only">Arrow key up</span>
          </kbd>
          &nbsp;
          <span>Navigate Up</span> 
        </li>
        <li>
          <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"/>
            </svg>
            <span class="sr-only">Arrow key down</span>
          </kbd>
          &nbsp;
          <span>Navigate Down</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
            </svg>
            <span class="sr-only">Arrow key left</span>
          </kbd>
          &nbsp;
          <span>Navigate Left</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
            </svg>
            <span class="sr-only">Arrow key right</span>
          </kbd>
          &nbsp;
          <span>Navigate Right</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z"/>
            </svg>
            <span class="sr-only">Arrow key up</span>
          </kbd>
          &nbsp;
          <span>Move Up</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
              <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"/>
            </svg>
            <span class="sr-only">Arrow key down</span>
          </kbd>
          &nbsp;
          <span>Move Down</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z"/>
            </svg>
            <span class="sr-only">Arrow key left</span>
          </kbd>
          &nbsp;
          <span>Move Left</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">m</kbd> + <kbd class="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
            </svg>
            <span class="sr-only">Arrow key right</span>
          </kbd>
          &nbsp;
          <span>Move Right</span> 
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">s</kbd>
          &nbsp;
          <span>Place in S</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">a</kbd>
          &nbsp;
          <span>Place in A</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">b</kbd>
          &nbsp;
          <span>Place in B</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">c</kbd>
          &nbsp;
          <span>Place in C</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">d</kbd>
          &nbsp;
          <span>Place in D</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">f</kbd>
          &nbsp;
          <span>Place in F</span>
        </li>
        <li>
          <kbd class="rtl:rotate-180 inline-flex items-center px-2 text-gray-800 bg-white border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">backspace</kbd>
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
            'bg-ns-500/70': (mode === 'insert' && cursorZ !== index),
            [colors[index % colors.length]]: (mode === 'view' || mode === 'edit')
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
                'bg-ns-500/70': ((bufferedX !== index || cursorY !== tierIndex) && mode === 'edit'),
                [colors[Math.floor(Math.random() * colors.length)]]: (mode === 'view' || mode === 'insert')
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
      drag: false,
      isNew: false,
      isUpload: false,
      isCopy: false
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
      if (!evt || this.isNew) return;

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
        this.isNew = true;
        Swal.fire({
          title: 'New Item',
          input: 'text'
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            // push to the front
            this.items.unshift({ name: result.value, id: this.items.length + 1 });
            this.cursorZ = Math.max(this.cursorZ, 0);
          }
        }).finally(() => {
          this.isNew = false;
        });
        return;
      }

      if (this.pressed.has("p")) {
        this.isCopy = true;
        this.handleCopy();
        return;
      }

      if (this.pressed.has("u")) {
        this.isUpload = true;
        this.handleUpload();
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
      }).then(() => {
        this.isCopy = false;
      });
    },
    handleUpload() {
      // uploads tiers from json string
      Swal.fire({
        title: 'Upload Tiers',
        input: 'textarea',
        inputPlaceholder: 'Paste tiers here',
        inputValue: JSON.stringify({
          items: this.items.map(item => item.name),
          tiers: this.tiers.map(tier => tier.map(item => item.name))
        }),
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
      }).then(() => {
        this.isUpload = false;
      });
    }
  },
};
</script>