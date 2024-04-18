import { defineStore } from 'pinia'
import type { Notification } from '@/interfaces/rest/Notification';

export const useNotifStore = defineStore('notif', {
    state: () => ({
        notif: null as Notification[] | null,
        count: 0 as number,
        unreadCount: 0 as number
    }),
    getters: {
        getNotif(): any {
            return this.notif;
        },
        getCount(): any {
            return this.count;
        },
        getUnreadCount(): any {
            return this.unreadCount;
        }
    },
    actions: {
        setNotif(notif: Notification[] | []) {
            this.notif = notif;
            this.count = notif.length;
            this.unreadCount = 0;

            this.notif.map((data) => {
                if (data.isread == '0') this.unreadCount++;
            })
        },
        setRead(id: number) {
            this.notif?.map((data) => {
                if (data.id == id) data.isread = '1';
            });
            this.unreadCount--;
        },
        addNotif(notif: Notification) {
            this.notif?.unshift(notif);
            this.count++;
            this.unreadCount++;
        },
    }
});
