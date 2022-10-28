import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('main',
  {
    state: () => ({
      userId: "",
      houseResourceNo: ""
    }),
    actions: {
      changeUserId(e: any) {
        this.userId = e
      },
      changeHouse(e: string) {
        this.houseResourceNo = e
      }
    }
  }
)
