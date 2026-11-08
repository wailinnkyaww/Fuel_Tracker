import { FUEL_RULES } from "../constants/config";
import { FuelRecord, EligibilityResult } from "../types/fuel";

export const checkFuelEligibility = (
  records: FuelRecord[],
  vehicleId: string,
  newLiters: number = 0,
): EligibilityResult => {
  if (!vehicleId) {
    return {
      allowed: false,
      reason: "ကျေးဇူးပြု၍ ယာဉ် ရွေးချယ်ပေးပါ",
      recentCount: 0,
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - FUEL_RULES.DAYS_PERIOD);

  // 1. သက်ဆိုင်ရာ Vehicle ၏ လွန်ခဲ့သော ၇ ရက်အတွင်း မှတ်တမ်းများကို ရက်စွဲအလိုက် စစ်ထုတ်ခြင်း
  const vehicleRecords = records
    .filter((item) => {
      const recordDate = new Date(item.date);
      return (
        item.vehicleId === vehicleId &&
        recordDate >= sevenDaysAgo &&
        recordDate <= now
      );
    })
    // အစောဆုံးထည့်ထားသည့် မှတ်တမ်းကို ထိပ်ဆုံးရောက်အောင် ရက်စွဲအလိုက် စီခြင်း (Ascending Sort)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const currentCount = vehicleRecords.length;

  // 2. ၁ ကြိမ်လျှင် ၄ လီတာထက် ပိုမပို စစ်ဆေးခြင်း
  if (newLiters > FUEL_RULES.MAX_LITERS_PER_TRANSACTION) {
    return {
      allowed: false,
      reason: `တစ်ကြိမ်လျှင် အများဆုံး ${FUEL_RULES.MAX_LITERS_PER_TRANSACTION} လီတာသာ ထည့်ခွင့်ရှိပါသည်။`,
      recentCount: currentCount,
    };
  }

  // 3. ၇ ရက်အတွင်း ၂ ကြိမ် ထည့်ပြီး/မပြီး စစ်ဆေးခြင်း
  if (currentCount >= FUEL_RULES.MAX_TRANSACTIONS_PER_PERIOD) {
    // လွန်ခဲ့သော ၇ ရက်အတွင်းမှ အစောဆုံးထည့်ခဲ့သည့် ရက်စွဲကို ယူပါ
    const oldestRecordDate = new Date(vehicleRecords[0].date);

    // အစောဆုံးထည့်ခဲ့သည့်ရက် + ၇ ရက် တွက်ထုတ်ပါ
    const nextAvailable = new Date(oldestRecordDate);
    nextAvailable.setDate(oldestRecordDate.getDate() + FUEL_RULES.DAYS_PERIOD);

    // လူနားလည်လွယ်သည့် ဖော်မတ်ဖြင့် ရက်စွဲဖော်ပြရန်
    const formattedNextDate = nextAvailable.toLocaleString("my-MM", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return {
      allowed: false,
      reason: `လွန်ခဲ့သော ၇ ရက်အတွင်း အများဆုံး ${FUEL_RULES.MAX_TRANSACTIONS_PER_PERIOD} ကြိမ် ပြည့်သွားပါပြီ။`,
      recentCount: currentCount,
      nextAvailableDate: formattedNextDate,
    };
  }

  return {
    allowed: true,
    reason: "ဆီထည့်သွင်းရန် ခွင့်ပြုထားပါသည်။",
    recentCount: currentCount,
    remainingCount: FUEL_RULES.MAX_TRANSACTIONS_PER_PERIOD - currentCount,
  };
};
