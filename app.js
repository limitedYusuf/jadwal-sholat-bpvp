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
      }
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
         const date = new Date();
         const times = prayTimes.getTimes(date, coordinates);

         this.prayerTimes.Fajr = times.fajr;
         this.prayerTimes.Dhuhr = times.dhuhr;
         this.prayerTimes.Asr = times.asr;
         this.prayerTimes.Maghrib = times.maghrib;
         this.prayerTimes.Isha = times.isha;

         if (this.applyIhtiyati === 'true') {
            this.addIhtiyatiTime(this.prayerTimes.Fajr, 2, 'Fajr');
            this.addIhtiyatiTime(this.prayerTimes.Dhuhr, 2, 'Dhuhr');
            this.addIhtiyatiTime(this.prayerTimes.Asr, 2, 'Asr');
            this.addIhtiyatiTime(this.prayerTimes.Maghrib, 2, 'Maghrib');
            this.addIhtiyatiTime(this.prayerTimes.Isha, 2, 'Isha');
         }
      },
      addIhtiyatiTime(timeStr, minutes, prayerName) {
         const timeParts = timeStr.split(':');
         const hours = parseInt(timeParts[0]);
         const newMinutes = parseInt(timeParts[1]) + minutes;
         if (newMinutes >= 60) {
            hours += 1;
            newMinutes -= 60;
         }
         this.prayerTimes[prayerName] = `${String(hours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      }
   },
   created() {
      this.calculatePrayerTimes();
   },
   watch: {
      selectedMethod: 'calculatePrayerTimes',
      applyIhtiyati: 'calculatePrayerTimes'
   }
});