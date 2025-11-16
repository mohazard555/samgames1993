
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">سياسة الخصوصية</h1>
      <div className="space-y-4 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold">مرحباً يا أصدقاء!</h2>
        <p>نحن في "ToysGame World" نهتم بسلامتكم وسعادتكم. هذه الصفحة لتخبركم كيف نحافظ على معلوماتكم آمنة.</p>
        
        <h3 className="text-xl font-bold">ما هي المعلومات التي نجمعها؟</h3>
        <p>نحن لا نجمع أي معلومات شخصية عنكم مثل الاسم أو العنوان. اللعب على موقعنا آمن تماماً.</p>
        
        <h3 className="text-xl font-bold">الإعدادات المحفوظة</h3>
        <p>عندما تغيرون إعدادات الموقع، مثل اسم الموقع أو الموسيقى، يتم حفظ هذه الإعدادات على جهاز الكمبيوتر الخاص بكم فقط. لا يمكن لأي شخص آخر رؤيتها.</p>
        
        <h3 className="text-xl font-bold">روابط يوتيوب</h3>
        <p>عندما تضغطون على زر الاشتراك، يتم توجيهكم إلى قناة على يوتيوب. يوتيوب لديه سياسة خصوصية خاصة به، لذا من الجيد أن يكون أحد الوالدين معكم.</p>

        <h3 className="text-xl font-bold">سلامتكم أولاً!</h3>
        <p>نحن نعمل بجد لنجعل "ToysGame World" مكاناً آمناً وممتعاً. إذا كان لديكم أي أسئلة، اطلبوا من والديكم مساعدتكم في التواصل معنا.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
