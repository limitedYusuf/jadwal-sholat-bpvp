new Vue({
   el: '#app',
   data: {
      selectedMethod: 'Fiqh',
      applyIhtiyati: 'true',
      calculationMethods: [
         'Fiqh',
         'ISNA',
         'MWL',
         'Makkah',
         'Karachi',
         'Egypt',
         'Jafari',
         'Tehran',
         'Muslim World League',
         'Umm al-Qura',
         'Singapore',
         'Malaysia',
         'Turkey',
         'France',
         'North America',
         'Shia Ithna-Ashari',
      ],
      prayerTimes: {
         'Fajr': '',
         'Dhuhr': '',
         'Asr': '',
         'Maghrib': '',
         'Isha': '',
      },
      dateList: [],
      PrayTimesToday: {
         'Fajr': '',
         'Dhuhr': '',
         'Asr': '',
         'Maghrib': '',
         'Isha': '',
      },
      namaBulan: '',
   },
   methods: {
      calculatePrayerTimes() {
         const prayTimes = new PrayTimes();
         if (this.selectedMethod === 'Fiqh') {
            const coordinates = [-0.50, 117.12];
            const date = new Date();
            const fajrAngle = 20.0;
            const asrRatio = 1.0;
            const ishaAngle = 18.0;
            const imsakOffset = 10;

            prayTimes.setMethod('Custom');
            prayTimes.adjust({
               fajr: fajrAngle,
               asr: asrRatio,
               isha: ishaAngle,
               imsak: imsakOffset
            });
         } else {
            prayTimes.setMethod(this.selectedMethod);
         }

         const coordinates = [-0.50, 117.12];
         const currentDate = new Date();

         this.dateList = [];

         const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

         for (let i = 1; i <= lastDay; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const times = prayTimes.getTimes(date, coordinates);

            const day = {
               date: this.formatDate(date),
               prayerTimes: {
                  Fajr: times.fajr,
                  Dhuhr: times.dhuhr,
                  Asr: times.asr,
                  Maghrib: times.maghrib,
                  Isha: times.isha,
               }
            };

            this.dateList.push(day);

            if (i === currentDate.getDate()) {
               this.PrayTimesToday = {
                  Fajr: times.fajr,
                  Dhuhr: times.dhuhr,
                  Asr: times.asr,
                  Maghrib: times.maghrib,
                  Isha: times.isha,
               };
            }
         }

         if (this.applyIhtiyati === 'true') {
            for (let i = 0; i < this.dateList.length; i++) {
               const day = this.dateList[i];
               this.addIhtiyatiTime(day.prayerTimes, 2, 'Fajr');
               this.addIhtiyatiTime(day.prayerTimes, 2, 'Dhuhr');
               this.addIhtiyatiTime(day.prayerTimes, 2, 'Asr');
               this.addIhtiyatiTime(day.prayerTimes, 2, 'Maghrib');
               this.addIhtiyatiTime(day.prayerTimes, 2, 'Isha');
            }
            const currentDate = new Date();
            this.PrayTimesToday = this.dateList.find(day => parseInt(day.date) === currentDate.getDate()).prayerTimes;
         }
      },
      addIhtiyatiTime(prayerTimes, minutes, prayerName) {
         const timeParts = prayerTimes[prayerName].split(':');
         let hours = parseInt(timeParts[0]);
         let newMinutes = parseInt(timeParts[1]) + minutes;
         if (newMinutes >= 60) {
            hours += 1;
            newMinutes -= 60;
         }
         prayerTimes[prayerName] = `${String(hours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      },
      formatDate(date) {
         const day = date.getDate().toString().padStart(2, '0');
         const month = (date.getMonth() + 1).toString().padStart(2, '0');
         return `${day}-${month}-${date.getFullYear()}`;
      },
   },
   created() {
      const months = [
         'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const currentDate = luxon.DateTime.local();
   
      currentDate.setZone('Asia/Makassar');
      
      this.namaBulan = months[currentDate.month - 1];
      
      const prayTimes = new PrayTimes();
      const coordinates = [-0.50, 117.12];
      const times = prayTimes.getTimes(currentDate.toJSDate(), coordinates);
      this.PrayTimesToday = {
         Fajr: times.fajr,
         Dhuhr: times.dhuhr,
         Asr: times.asr,
         Maghrib: times.maghrib,
         Isha: times.isha,
      };
      this.calculatePrayerTimes();
   },    
   watch: {
      selectedMethod: 'calculatePrayerTimes',
      applyIhtiyati: 'calculatePrayerTimes'
   },
});