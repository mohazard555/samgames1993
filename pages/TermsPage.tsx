
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">الشروط والأحكام</h1>
      <div className="space-y-4 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold">أهلاً بكم في ToysGame World!</h2>
        <p>باستخدامكم لموقعنا، أنتم توافقون على هذه الشروط البسيطة:</p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>استخدام الموقع:</strong> الموقع مخصص للعب والمرح. يرجى استخدامه بطريقة لطيفة ومحترمة.</li>
          <li><strong>الألعاب:</strong> نحن نقدم ألعاباً ممتعة. هذه الألعاب هي لأغراض ترفيهية فقط.</li>
          <li><strong>الاشتراك الإجباري:</strong> قبل لعب أي لعبة، نطلب منكم دعمنا بالاشتراك في إحدى قنوات يوتيوب المقترحة. هذا يساعدنا على تقديم المزيد من الألعاب المجانية.</li>
          <li><strong>المسؤولية:</strong> استمتعوا بوقتكم، ولكن تذكروا أن اللعب الآمن مسؤوليتكم. من الجيد دائماً أن يكون أحد الوالدين على علم بما تفعلونه على الإنترنت.</li>
          <li><strong>التغييرات:</strong> قد نقوم بتغيير هذه الشروط من وقت لآخر لنجعل الموقع أفضل.</li>
        </ol>

        <p className="mt-6">شكراً للعب معنا، نتمنى لكم وقتاً ممتعاً!</p>
      </div>
    </div>
  );
};

export default TermsPage;
