import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('main',
  {
    state: () => ({
      userId: "",
      houseResourceNo: "",
      house: {
        isCollectFlag: "",
        houseResourceImg: "",
        houseResourceName: "",
        locationName: "",
        rentType: "",
        memo: []
      }
    }),
    actions: {
      changeUserId(e: any) {
        this.userId = e
      },
      changeHouseNo(e: string) {
        this.houseResourceNo = e
      },
      changeHouse(e: any) {
        this.house = e
      }
    }
  }
)
