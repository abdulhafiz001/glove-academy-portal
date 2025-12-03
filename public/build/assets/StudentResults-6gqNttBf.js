import{e as xe,a as fe,u as ve,r as p,j as e,C as T,d as be,A as ye}from"./app-17JNjqSJ.js";import{A as Y}from"./AppLayout-DeHBSdFD.js";import"./file-text-Znh3F_nC.js";import"./chart-column-NFp01_3v.js";import"./book-open-D3qBa7nK.js";import"./graduation-cap-mrkAgQ1z.js";import"./user-CAmUnVMn.js";import"./log-out-Bc-nJCmd.js";import"./menu-BL5-W5Xp.js";const Le=({student:J,results:y={},class_history:R={},current_session:u,admission_session:_,admission_term:C})=>{const{props:we}=xe(),{user:Z}=fe(),{showError:F,showSuccess:Q}=ve(),n=J||Z,[h,D]=p.useState("Second Term"),[o,z]=p.useState(""),[f,P]=p.useState(y),[I,ee]=p.useState([]),[N,te]=p.useState(u),[U,se]=p.useState(_),[O,ae]=p.useState(C),[M,V]=p.useState([]),[E,re]=p.useState(R),[ne,ie]=p.useState([]),[oe,je]=p.useState(!1),ce=t=>{var a,i;if(E&&E[t]){const r=E[t];if(typeof r=="object"&&r.name)return r.name;if(typeof r=="string")return r}return((a=n==null?void 0:n.school_class)==null?void 0:a.name)||((i=n==null?void 0:n.schoolClass)==null?void 0:i.name)||"Loading..."},de=()=>h!=="Third Term"?null:(n==null?void 0:n.status)==="graduated"?"graduated":(n==null?void 0:n.status)==="repeated"?"repeated":n!=null&&n.promoted_this_session?"promoted":null,s=p.useMemo(()=>{var t,a;return{name:n?`${n.first_name} ${n.last_name}`:"Loading...",admissionNumber:(n==null?void 0:n.admission_number)||"Loading...",class:o?ce(o):((t=n==null?void 0:n.school_class)==null?void 0:t.name)||((a=n==null?void 0:n.schoolClass)==null?void 0:a.name)||"Loading...",session:o||(N==null?void 0:N.name)||"Not Set",promotionStatus:de()}},[o,E,n,N,h]),w={name:"G-LOVE ACADEMY",logo:"/images/G-LOVE ACADEMY.jpeg",address:"BESIDE ASSEMBLIES OF GOD CHURCH ZONE 9 LUGBE ABUJA"};p.useEffect(()=>{if(u&&te(u),_&&se(_),C&&ae(C),Object.keys(R).length>0&&re(R),n!=null&&n.student_subjects){const t=n.student_subjects.map(a=>a.subject&&a.subject.id?a.subject.id:a.subject_id?a.subject_id:null).filter(a=>a!==null);V(t)}else if(n!=null&&n.studentSubjects){const t=n.studentSubjects.map(a=>a.subject&&a.subject.id?a.subject.id:a.subject_id?a.subject_id:null).filter(a=>a!==null);V(t)}if(Object.keys(y).length>0){P(y);const t=Object.keys(y);ee(t);const a=[];u&&a.push({name:u.name,id:u.id}),t.forEach(r=>{if(!a.find(d=>d.name===r)){const d=y[r];if(d){const c=Object.keys(d)[0];if(c&&d[c]&&d[c].length>0){const m=d[c][0];m.academic_session?a.push({name:r,id:m.academic_session.id}):m.academic_session_id&&a.push({name:r,id:m.academic_session_id})}}}}),ie(a);let i="";if(u?i=u.name:t.length>0&&(i=t[0]),z(i),i&&y[i]){const r=Object.keys(y[i]);r.length>0&&D(r[0])}}else u&&z(u.name)},[y,u,_,C,R,n]),p.useEffect(()=>{if(o&&f[o]){const t=Object.keys(f[o]);t.length>0&&D(t[0])}},[o,f]);const W=()=>!o||!f[o]?[]:Object.keys(f[o]),H=()=>!o||!h||!f[o]||!f[o][h]?[]:f[o][h]||[],q=[{grade:"A",min:80,max:100,remark:"Excellent"},{grade:"B",min:70,max:79,remark:"Very Good"},{grade:"C",min:60,max:69,remark:"Good"},{grade:"D",min:50,max:59,remark:"Fair"},{grade:"E",min:40,max:49,remark:"Pass"},{grade:"F",min:0,max:39,remark:"Fail"}],le=t=>{switch(t){case"A+":return"text-green-800 bg-green-100";case"A":return"text-green-700 bg-green-50";case"B+":return"text-blue-700 bg-blue-50";case"B":return"text-blue-600 bg-blue-50";case"C":return"text-yellow-700 bg-yellow-50";case"D":return"text-orange-700 bg-orange-50";case"F":return"text-red-700 bg-red-50";default:return"text-gray-700 bg-gray-50"}},K=t=>t.map(a=>{const i=parseFloat(a.first_ca)||0,r=parseFloat(a.second_ca)||0,d=parseFloat(a.exam_score)||0,c=i+r+d;let m="";a.subject&&typeof a.subject=="object"&&a.subject.name?m=a.subject.name:typeof a.subject=="string"?m=a.subject:m="Unknown Subject";let b="F",x="Fail";for(const $ of q)if(c>=$.min&&c<=$.max){b=$.grade,x=$.remark;break}return{...a,subject:m,first_ca:i,second_ca:r,exam:d,total:c,grade:b,gradeRemark:x,percentage:c}}),g=t=>t[Math.floor(Math.random()*t.length)],S=H(),l=K(S),X=l.reduce((t,a)=>t+a.total,0),B=l.length>0?(X/l.length).toFixed(1):0,v=(()=>{if(h!=="Third Term"||!o||!f[o])return null;const t=f[o],a=t["First Term"]||[],i=t["Second Term"]||[],r=t["Third Term"]||[],d=x=>{if(!x||x.length===0)return null;const L=K(x),$=L.reduce((ge,ue)=>ge+ue.total,0);return L.length>0?parseFloat(($/L.length).toFixed(2)):null},c=d(a),m=d(i),b=d(r);if(c!==null&&m!==null&&b!==null){const x=parseFloat(((c+m+b)/3).toFixed(2));return{firstTermAverage:c,secondTermAverage:m,thirdTermAverage:b,finalAverage:x}}return null})(),G=(()=>{if(!M||M.length===0||!S||S.length===0)return!1;const t=S.map(r=>{if(r.subject_id)return r.subject_id;if(r.subject){if(typeof r.subject=="object"&&r.subject.id)return r.subject.id;if(typeof r.subject=="number")return r.subject}return null}).filter(r=>r!==null);return M.every(r=>t.includes(r))?S.every(r=>{var x;const d=r.first_ca!==null&&r.first_ca!==void 0,c=r.second_ca!==null&&r.second_ca!==void 0,m=r.exam_score!==null&&r.exam_score!==void 0,b=d&&c&&m;return b||be.log("Incomplete scores for subject:",((x=r.subject)==null?void 0:x.name)||r.subject_id,{first_ca:r.first_ca,second_ca:r.second_ca,exam_score:r.exam_score}),b}):!1})();let j="",k="";const A=parseFloat(B);if(A>=80){const t=[`Absolutely outstanding performance this term! ${s.name} has demonstrated exceptional understanding across all subjects and consistently delivers work of the highest quality. This level of academic excellence is truly commendable and sets a wonderful example for other students.`,`What a remarkable achievement! ${s.name} has shown mastery in every subject area and continues to exceed expectations. The dedication to learning and consistent high performance is inspiring. Keep up this phenomenal work!`,`Exceptional work throughout this term! ${s.name} displays brilliant analytical skills and deep understanding of concepts. The consistent excellence across all subjects reflects outstanding commitment to academic success. This is truly exemplary performance.`,`Absolutely brilliant academic performance! ${s.name} has achieved excellence in every aspect of learning this term. The thoroughness of work and depth of understanding demonstrated is remarkable. Continue this outstanding trajectory!`],a=[`${s.name} has brought great honor to our school this term with such outstanding academic excellence. This level of achievement reflects not just intelligence, but also exceptional dedication and strong character. We are incredibly proud of this remarkable performance.`,`What an extraordinary academic achievement! ${s.name} has demonstrated the highest standards of excellence and continues to be a shining example of what dedication and hard work can accomplish. The school community celebrates this outstanding success.`,`Truly exceptional performance that makes the entire school proud! ${s.name} has shown remarkable consistency in achieving excellence across all subjects. This outstanding academic achievement reflects strong values and commitment to learning.`,`${s.name} has achieved academic excellence that stands as an inspiration to the entire school community. This remarkable performance demonstrates exceptional ability, dedication, and the pursuit of excellence in all endeavors. Congratulations on this outstanding achievement!`];j=g(t),k=g(a)}else if(A>=70){const t=[`Excellent work this term! ${s.name} has shown strong understanding across most subjects and consistently produces quality work. There are still opportunities to reach even greater heights, but this performance demonstrates solid academic foundation and good study habits.`,`Very impressive academic performance! ${s.name} displays good grasp of concepts and shows consistent effort in all subject areas. With continued focus and perhaps a bit more attention to detail, even higher achievements are definitely within reach.`,`Strong academic showing this term! ${s.name} has performed well across all subjects and shows good analytical thinking. The work quality is commendable, and with sustained effort, excellent results can be achieved in the next term.`,`Commendable academic performance! ${s.name} demonstrates solid understanding and good work ethic. The results reflect consistent effort and good study habits. Keep pushing forward as there's definitely potential for even greater success.`],a=[`${s.name} has achieved very good results this term and should be proud of this solid academic performance. The consistency shown across subjects reflects good character and steady work ethic. With continued dedication, even greater achievements await.`,`Well done on achieving such good academic results! ${s.name} has demonstrated reliable performance and good understanding across all subject areas. This steady progress and consistent effort are qualities that will lead to continued success.`,`${s.name} has shown commendable academic performance this term. The good results achieved reflect steady application and growing understanding. Continue this positive trajectory and even better results will surely follow.`,`Very pleased with ${s.name}'s academic progress this term. The good performance across subjects shows developing maturity and consistent effort. Keep up the good work and strive for even greater excellence next term.`];j=g(t),k=g(a)}else if(A>=60){const t=[`Good academic progress this term! ${s.name} shows understanding in most areas but there's room for improvement in consistency and depth of work. Focus on strengthening weaker subjects while maintaining performance in stronger areas. More regular practice and review will help achieve better results.`,`Satisfactory performance with potential for growth! ${s.name} demonstrates good effort in several subjects but needs to work on maintaining consistency across all areas. Additional attention to homework completion and class participation will definitely improve overall results.`,`Decent academic showing this term! ${s.name} has achieved reasonable results but there's clear potential for higher performance. Focus on improving study techniques, time management, and seeking help when concepts are unclear. Better results are definitely achievable.`,`Fair academic performance with room for enhancement! ${s.name} shows good understanding in some subjects but needs more consistent effort across all areas. Regular revision, completing all assignments, and active participation in class will lead to improved results.`],a=[`${s.name} has achieved fair results this term but we know there's potential for much better performance. Focus on developing better study habits, managing time effectively, and seeking support when needed. Consistent effort will lead to improved academic outcomes.`,`Reasonable academic performance from ${s.name} this term, but there's definite room for improvement. Work on strengthening fundamental concepts, improving attendance, and being more engaged in classroom activities. Better results are within reach with increased effort.`,`${s.name} has shown moderate progress this term but can certainly achieve more with increased dedication. Focus on completing all assignments, participating actively in class, and developing more effective study strategies for better academic success.`,`Fair academic results from ${s.name} this term. While the performance is acceptable, there's clear potential for significant improvement. Encourage more consistent study habits, better time management, and active engagement with learning materials.`];j=g(t),k=g(a)}else if(A>=50){const t=[`${s.name} has achieved average results this term, which shows basic understanding but indicates significant room for improvement. Focus on strengthening fundamental concepts, improving homework completion rates, and seeking additional help when struggling with topics. More consistent effort is needed for better outcomes.`,`Average performance this term shows that ${s.name} grasps some concepts but struggles with consistency and depth. Recommend developing better study routines, attending extra lessons when available, and working more closely with subject teachers to identify and address specific weaknesses.`,`The results indicate that ${s.name} is working at an average level but has the potential to achieve much more. Focus on improving concentration during lessons, completing all assignments thoroughly, and developing more effective study techniques. Regular practice will lead to better understanding.`,`${s.name} shows average academic performance which suggests the need for more focused effort and better study strategies. Work on time management, regular revision, and don't hesitate to ask questions when concepts are unclear. Improvement is definitely possible with increased dedication.`],a=[`${s.name} has achieved average results this term, but we believe there's much more potential to be unlocked. Encourage the development of better study habits, improved class attendance, and more active participation in learning activities. Academic success requires consistent effort and dedication.`,`The academic performance shown by ${s.name} this term is average but concerning as it indicates unrealized potential. Focus should be on developing discipline in studies, better time management, and seeking support from teachers and parents to improve academic outcomes.`,`${s.name} has performed at an average level this term which, while acceptable, falls short of what we believe can be achieved. Encourage more serious commitment to studies, regular homework completion, and active engagement with learning materials for better results.`,`Average academic results from ${s.name} this term suggest the need for renewed focus and commitment to learning. Work together with teachers and parents to develop strategies for improvement, better study habits, and increased motivation towards academic success.`];j=g(t),k=g(a)}else if(A>=40){const t=[`${s.name} has achieved below average results this term, which indicates significant challenges in understanding core concepts. Immediate attention is needed to address fundamental gaps in knowledge. Recommend intensive remedial work, additional tutoring, and more structured study routines to improve academic performance.`,`The results show that ${s.name} is struggling with basic concepts and needs immediate intervention. Focus on building foundational knowledge, improving attendance, and developing more effective study habits. Regular one-on-one support and additional resources are essential for improvement.`,`Below average performance indicates that ${s.name} requires substantial academic support to catch up with peers. Work on strengthening basic skills, improving homework completion, and seeking help immediately when concepts are unclear. This situation requires urgent attention and dedicated effort.`,`${s.name} shows concerning academic performance that requires immediate intervention. Focus on developing basic study skills, improving class participation, and working closely with teachers to identify specific areas of weakness. Significant improvement is needed to reach acceptable academic standards.`],a=[`${s.name} has achieved concerning academic results this term that require immediate attention from both school and home. The below average performance indicates significant gaps in fundamental knowledge that must be addressed through intensive remedial work and increased support.`,`The academic performance shown by ${s.name} this term is below acceptable standards and requires urgent intervention. Work closely with teachers to develop a comprehensive improvement plan, increase study time, and provide additional academic support to help catch up with peers.`,`${s.name} has performed below expected academic standards this term, which is concerning. Immediate action is needed to address fundamental learning gaps through remedial classes, improved study habits, and increased parental involvement in academic progress.`,`Below average results from ${s.name} this term indicate serious academic challenges that require immediate and sustained intervention. Develop a structured improvement plan, increase study time, and work closely with teachers to address specific weaknesses and improve overall performance.`];j=g(t),k=g(a)}else{const t=[`${s.name} has achieved very poor results this term, which indicates severe academic difficulties that require immediate and intensive intervention. The performance suggests fundamental gaps in understanding that need urgent attention through remedial work, additional tutoring, and comprehensive academic support.`,`Extremely concerning academic performance from ${s.name} this term requires immediate action. The results indicate serious learning challenges that need to be addressed through intensive remedial programs, increased study time, and close monitoring of academic progress.`,`The poor academic results from ${s.name} this term are alarming and require urgent intervention. Focus on building basic academic skills, improving attendance, and developing fundamental study habits. This situation needs immediate attention from teachers, parents, and academic support staff.`,`${s.name} shows critically poor academic performance that demands immediate and comprehensive intervention. Work on developing basic learning skills, improving classroom engagement, and seeking intensive academic support to address fundamental knowledge gaps.`],a=[`${s.name} has achieved critically poor academic results this term that require immediate and comprehensive intervention. The performance indicates severe academic difficulties that need urgent attention through intensive remedial work, increased support, and close monitoring of progress.`,`The extremely poor academic performance from ${s.name} this term is concerning and requires immediate action. Develop a comprehensive improvement plan that includes remedial classes, increased study time, and close collaboration between school and home to address fundamental learning gaps.`,`${s.name} has performed at critically low academic levels this term, which requires urgent and sustained intervention. Work together with teachers, parents, and support staff to develop intensive remedial programs and provide the necessary resources for academic improvement.`,`Critically poor academic results from ${s.name} this term demand immediate and comprehensive intervention. This situation requires intensive remedial work, increased academic support, and close collaboration between all stakeholders to address fundamental learning challenges and improve academic outcomes.`];j=g(t),k=g(a)}if(oe)return e.jsx(Y,{children:e.jsx("div",{className:"flex items-center justify-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2",style:{borderColor:T.primary.red}})})});const me=(t=!1)=>`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Result - ${s.name}</title>
          <style>
            @media print {
              @page { 
                size: A4; 
                margin: 10mm;
              }
              body { 
                margin: 0; 
                padding: 0;
              }
              .no-print { 
                display: none !important; 
              }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: ${t?"0":"20px"}; 
              padding: ${t?"10mm":"0"};
              background: white;
              font-size: ${t?"10px":"14px"};
              position: relative;
            }
            /* Watermark */
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              opacity: 0.08;
              z-index: 0;
              text-align: center;
              width: 100%;
              height: 100vh;
              pointer-events: none;
              overflow: hidden;
            }
            .watermark-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .watermark-logo {
              width: 250px;
              height: 250px;
              margin-bottom: 30px;
              opacity: 0.12;
              object-fit: contain;
            }
            .watermark-text {
              font-size: 80px;
              font-weight: bold;
              color: #aecb1f;
              text-transform: uppercase;
              letter-spacing: 10px;
              white-space: nowrap;
            }
            /* Ensure content appears above watermark */
            .result-content { 
              max-width: ${t?"100%":"800px"}; 
              margin: 0 auto;
              position: relative;
              z-index: 1;
            }
            .school-header { 
              text-align: center; 
              margin-bottom: ${t?"10px":"30px"}; 
            }
            .school-logo { 
              width: ${t?"60px":"80px"}; 
              height: auto; 
              margin: 0 auto ${t?"5px":"10px"}; 
              display: block; 
            }
            .school-name { 
              font-size: ${t?"16px":"24px"}; 
              font-weight: bold; 
              margin: ${t?"5px 0":"10px 0"}; 
            }
            .school-address { 
              font-size: ${t?"10px":"14px"}; 
              color: #666; 
              margin-bottom: ${t?"10px":"20px"}; 
            }
            .student-info {
              background: #f9f9f9;
              padding: ${t?"8px":"15px"};
              margin: ${t?"10px 0":"20px 0"};
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .student-info h3 {
              margin: 0 0 10px 0;
              color: #333;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: ${t?"8px 0":"20px 0"}; 
              font-size: ${t?"9px":"12px"};
            }
            th, td { 
              border: 1px solid #333; 
              padding: ${t?"4px":"8px"}; 
              text-align: center; 
            }
            th { 
              background-color: #f5f5f5; 
              font-weight: bold;
            }
            .text-left { text-align: left; }
            .remarks-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: ${t?"10px":"20px"};
              margin: ${t?"10px 0":"20px 0"};
            }
            .remark-box {
              border: 1px solid #ddd;
              padding: ${t?"8px":"15px"};
              background: #f9f9f9;
              border-radius: 5px;
              font-size: ${t?"9px":"12px"};
            }
            .remark-box h4 {
              margin: 0 0 10px 0;
              color: #333;
            }
            .grade-scale {
              margin: ${t?"10px 0":"20px 0"};
            }
            .grade-scale h4 {
              margin-bottom: ${t?"5px":"10px"};
              font-size: ${t?"11px":"14px"};
            }
            .grade-table {
              font-size: ${t?"8px":"11px"};
            }
            .summary-stats {
              background: #e8f4f8;
              padding: ${t?"8px":"15px"};
              border-radius: 5px;
              margin: ${t?"10px 0":"20px 0"};
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              text-align: center;
            }
            .stat-item {
              background: white;
              padding: 10px;
              border-radius: 3px;
            }
            .stat-value {
              font-size: ${t?"14px":"18px"};
              font-weight: bold;
              color: #aecb1f;
            }
            .stat-label {
              font-size: ${t?"9px":"12px"};
              color: #666;
            }
          </style>
        </head>
        <body>
          <!-- Watermark -->
          <div class="watermark">
            <div class="watermark-content">
              <img src="${w.logo}" alt="School Logo" class="watermark-logo" />
              <div class="watermark-text">${w.name}</div>
            </div>
          </div>
          
          <div class="result-content">
            <div class="school-header">
              <img src="${w.logo}" alt="School Logo" class="school-logo" />
              <div class="school-name">${w.name}</div>
              <div class="school-address">${w.address}</div>
            </div>

            <h2 style="text-align: center; color: #f30401; margin: ${t?"10px 0":"20px 0"}; font-size: ${t?"14px":"20px"};">STUDENT RESULT REPORT</h2>

            <div class="student-info">
              <h3>Student Information</h3>
              <div class="info-grid">
                <div><strong>Name:</strong> ${s.name}</div>
                <div><strong>Admission Number:</strong> ${s.admissionNumber}</div>
                <div><strong>Class:</strong> ${s.class}</div>
                <div><strong>Session:</strong> ${o}</div>
              </div>
              <div style="margin-top: 10px;"><strong>Term:</strong> ${h}</div>
              ${s.promotionStatus?`
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                  <strong>Promotion Status:</strong> 
                  <span style="font-weight: bold; 
                    ${s.promotionStatus==="promoted"?"color: #22c55e;":""}
                    ${s.promotionStatus==="graduated"?"color: #3b82f6;":""}
                    ${s.promotionStatus==="repeated"?"color: #ef4444;":""}
                  ">
                    ${s.promotionStatus==="promoted"?"✓ PROMOTED TO NEXT CLASS":""}
                    ${s.promotionStatus==="graduated"?"🎓 GRADUATED":""}
                    ${s.promotionStatus==="repeated"?"⚠ REPEATED - TO REPEAT CURRENT CLASS":""}
                  </span>
                </div>
              `:""}
            </div>

            <table>
              <thead>
                <tr>
                  <th class="text-left">Subject</th>
                  <th>1st Test (20)</th>
                  <th>2nd Test (20)</th>
                  <th>Exam (60)</th>
                  <th>Total (100)</th>
                  <th>Grade</th>
                                     <th>Percentage</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                ${l.map(i=>`
                  <tr>
                    <td class="text-left">${i.subject}</td>
                    <td>${i.first_ca}</td>
                    <td>${i.second_ca}</td>
                    <td>${i.exam}</td>
                    <td>${i.total}</td>
                    <td>${i.grade}</td>
                                         <td>${i.percentage}%</td>
                    <td>${i.remark}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="summary-stats">
              <h4 style="text-align: center; margin-bottom: 15px;">Performance Summary</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">${X}</div>
                  <div class="stat-label">Total Score</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${B}%</div>
                  <div class="stat-label">Average Score</div>
                </div>
                                 <div class="stat-item">
                   <div class="stat-value">${l.length}</div>
                   <div class="stat-label">Total Subjects</div>
                 </div>
              </div>
            </div>

            ${v&&h==="Third Term"?`
            <div style="margin: 15px 0; padding: 12px; background: white; border: 1px solid #e5e7eb; border-radius: 6px;">
              <h4 style="font-size: ${t?"10px":"12px"}; font-weight: 600; color: #111827; margin-bottom: 10px;">Final Average Calculation</h4>
              <div style="font-size: ${t?"8px":"10px"};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #4b5563;">First Term Average:</span>
                  <span style="font-weight: 500; color: #111827;">${v.firstTermAverage}%</span>
                </div>
                <div style="text-align: center; color: #9ca3af; margin: 2px 0; font-size: ${t?"8px":"10px"};">+</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #4b5563;">Second Term Average:</span>
                  <span style="font-weight: 500; color: #111827;">${v.secondTermAverage}%</span>
                </div>
                <div style="text-align: center; color: #9ca3af; margin: 2px 0; font-size: ${t?"8px":"10px"};">+</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #4b5563;">Third Term Average:</span>
                  <span style="font-weight: 500; color: #111827;">${v.thirdTermAverage}%</span>
                </div>
                <div style="text-align: center; color: #9ca3af; margin: 6px 0 4px 0; padding-top: 4px; border-top: 1px solid #e5e7eb; font-size: ${t?"8px":"10px"};">÷ 3</div>
                <div style="display: flex; justify-content: space-between; padding-top: 6px; margin-top: 6px; border-top: 1px solid #d1d5db;">
                  <span style="font-size: ${t?"9px":"11px"}; font-weight: 600; color: #111827;">Final Average for this Class:</span>
                  <span style="font-size: ${t?"11px":"13px"}; font-weight: bold; color: #dc2626;">${v.finalAverage}%</span>
                </div>
                <p style="font-size: ${t?"7px":"9px"}; color: #6b7280; margin-top: 6px; text-align: center;">
                  (First Term Average + Second Term Average + Third Term Average) ÷ 3
                </p>
              </div>
            </div>
            `:""}

            <div class="remarks-section">
              <div class="remark-box">
                <h4>Teacher's Remark</h4>
                <p>${j}</p>
              </div>
              <div class="remark-box">
                <h4>Principal's Remark</h4>
                <p>${k}</p>
              </div>
            </div>

            <div class="grade-scale">
              <h4>Grade Scale</h4>
              <table class="grade-table">
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Score Range</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  ${q.map(i=>`
                    <tr>
                      <td>${i.grade}</td>
                      <td>${i.min} - ${i.max}</td>
                      <td>${i.remark}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `,he=()=>{try{const t=me(),a=window.open("","_blank");a.document.write(t),a.document.close(),setTimeout(()=>{a.print()},1e3)}catch{alert("Failed to print result. Please try again.")}},pe=async()=>{try{if(!h){F("Please select a term to download the report card");return}if(!o){F("Please select an academic session");return}const a={"First Term":"first","Second Term":"second","Third Term":"third"}[h]||"first";let i=null;const r=ne.find(c=>c.name===o);if(r)i=r.id;else if(N&&N.name===o)i=N.id;else{const c=H();c.length>0&&c[0].academic_session?i=c[0].academic_session.id:c.length>0&&c[0].academic_session_id&&(i=c[0].academic_session_id)}if(!i){F("Could not find academic session. Please contact the administrator.");return}const d={term:a,academic_session_id:i};await ye.generateStudentReportCardSelf(d),Q("PDF downloaded successfully!")}catch(t){const a=t.message||"Failed to generate PDF report card. Please ensure you are logged in and have the required permissions.";F(a)}};return e.jsx(Y,{children:e.jsxs("div",{className:"min-h-screen bg-gray-50 py-8",children:[e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"My Results"}),e.jsx("p",{className:"text-gray-600",children:"View your academic performance and progress"}),e.jsxs("div",{className:"flex flex-col items-center mt-4 space-y-2",children:[e.jsx("img",{src:w.logo,alt:"School Logo",className:"h-40 w-40 object-contain"}),e.jsx("span",{className:"text-2xl font-bold text-gray-800",children:w.name}),e.jsx("span",{className:"text-gray-500 text-sm",children:w.address})]})]}),e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsxs("div",{id:"result-sheet",children:[e.jsx("div",{className:"bg-white shadow rounded-lg mb-6 p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900",children:s.name}),e.jsxs("p",{className:"text-sm text-gray-500",children:[s.class," • ",s.admissionNumber," • Session: ",s.session]}),s.promotionStatus&&e.jsxs("p",{className:`text-sm font-semibold mt-1 ${s.promotionStatus==="promoted"?"text-green-600":s.promotionStatus==="graduated"?"text-blue-600":s.promotionStatus==="repeated"?"text-red-600":""}`,children:[s.promotionStatus==="promoted"&&"✓ PROMOTED TO NEXT CLASS",s.promotionStatus==="graduated"&&"🎓 GRADUATED",s.promotionStatus==="repeated"&&"⚠ REPEATED - TO REPEAT CURRENT CLASS"]}),U&&e.jsxs("p",{className:"text-xs text-gray-400 mt-1",children:["Admitted: ",U.name," - ",O?`${O.charAt(0).toUpperCase()+O.slice(1)} Term`:""]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-4",children:[e.jsxs("div",{className:"w-full sm:w-auto",children:[e.jsx("label",{htmlFor:"session",className:"block text-sm font-medium text-gray-700 mb-1",children:"Academic Session"}),e.jsx("select",{id:"session",value:o,onChange:t=>{z(t.target.value)},className:"block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",children:I.length===0?e.jsx("option",{value:"",children:"No sessions available"}):I.map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs("div",{className:"w-full sm:w-auto",children:[e.jsx("label",{htmlFor:"term",className:"block text-sm font-medium text-gray-700 mb-1",children:"Term"}),e.jsx("select",{id:"term",value:h,onChange:t=>D(t.target.value),disabled:!o||W().length===0,className:"block w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed",children:W().length===0?e.jsx("option",{value:"",children:"No terms available"}):W().map(t=>e.jsx("option",{value:t,children:t},t))})]})]})]})}),l.length>0&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6 mb-8",children:[e.jsx("div",{className:"bg-white overflow-hidden shadow rounded-lg",children:e.jsx("div",{className:"p-5",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("div",{className:"w-8 h-8 rounded-md flex items-center justify-center text-white",style:{backgroundColor:T.primary.red},children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})})}),e.jsx("div",{className:"ml-5 w-0 flex-1",children:e.jsxs("dl",{children:[e.jsx("dt",{className:"text-sm font-medium text-gray-500 truncate",children:"Total Subjects"}),e.jsx("dd",{className:"text-lg font-medium text-gray-900",children:l.length})]})})]})})}),e.jsx("div",{className:"bg-white overflow-hidden shadow rounded-lg",children:e.jsx("div",{className:"p-5",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("div",{className:"w-8 h-8 rounded-md flex items-center justify-center text-white bg-green-500",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"})})})}),e.jsx("div",{className:"ml-5 w-0 flex-1",children:e.jsxs("dl",{children:[e.jsx("dt",{className:"text-sm font-medium text-gray-500 truncate",children:"Average Score"}),e.jsxs("dd",{className:"text-lg font-medium text-gray-900",children:[B,"%"]})]})})]})})}),e.jsx("div",{className:"bg-white overflow-hidden shadow rounded-lg",children:e.jsx("div",{className:"p-5",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("div",{className:"w-8 h-8 rounded-md flex items-center justify-center text-white",style:{backgroundColor:T.primary.yellow},children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"})})})}),e.jsx("div",{className:"ml-5 w-0 flex-1",children:e.jsxs("dl",{children:[e.jsx("dt",{className:"text-sm font-medium text-gray-500 truncate",children:"Highest Score"}),e.jsx("dd",{className:"text-lg font-medium text-gray-900",children:l.length>0?Math.max(...l.map(t=>t.total)):0})]})})]})})}),e.jsx("div",{className:"bg-white overflow-hidden shadow rounded-lg",children:e.jsx("div",{className:"p-5",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("div",{className:"w-8 h-8 rounded-md flex items-center justify-center text-white",style:{backgroundColor:T.primary.blue},children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})})})}),e.jsx("div",{className:"ml-5 w-0 flex-1",children:e.jsxs("dl",{children:[e.jsx("dt",{className:"text-sm font-medium text-gray-500 truncate",children:"Subjects Passed"}),e.jsxs("dd",{className:"text-lg font-medium text-gray-900",children:[l.filter(t=>t.total>=40).length,"/",l.length]})]})})]})})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-gray-200",children:[e.jsxs("h3",{className:"text-lg font-medium text-gray-900",children:[h," Results - ",o]}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"All scores are retrieved directly from the database as entered by subject teachers"})]}),l.length>0?e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Subject"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"1st Test (20)"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"2nd Test (20)"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Exam (60)"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Total (100)"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Grade"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Percentage"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Remark"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:l.map((t,a)=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",children:t.subject}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:t.first_ca}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:t.second_ca}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:t.exam}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",children:t.total}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:e.jsx("span",{className:`inline-flex px-2 py-1 text-xs font-medium rounded-full ${le(t.grade)}`,children:t.grade})}),e.jsxs("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:[t.percentage,"%"]}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:t.remark})]},a))})]})}):e.jsxs("div",{className:"px-6 py-12 text-center",children:[e.jsx("svg",{className:"mx-auto h-12 w-12 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsx("h3",{className:"mt-2 text-sm font-medium text-gray-900",children:"No results available"}),e.jsxs("p",{className:"mt-1 text-sm text-gray-500",children:["Results for ",h," have not been published yet."]})]})]}),v&&h==="Third Term"&&e.jsxs("div",{className:"mt-6 bg-white shadow rounded-lg p-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-900 mb-3",children:"Final Average Calculation"}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-gray-600",children:"First Term Average:"}),e.jsxs("span",{className:"font-medium text-gray-900",children:[v.firstTermAverage,"%"]})]}),e.jsx("div",{className:"flex items-center justify-center text-gray-400 text-xs",children:"+"}),e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-gray-600",children:"Second Term Average:"}),e.jsxs("span",{className:"font-medium text-gray-900",children:[v.secondTermAverage,"%"]})]}),e.jsx("div",{className:"flex items-center justify-center text-gray-400 text-xs",children:"+"}),e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-gray-600",children:"Third Term Average:"}),e.jsxs("span",{className:"font-medium text-gray-900",children:[v.thirdTermAverage,"%"]})]}),e.jsx("div",{className:"flex items-center justify-center text-gray-400 text-xs border-t border-gray-200 pt-2 mt-2",children:"÷ 3"}),e.jsxs("div",{className:"flex items-center justify-between pt-2 mt-2 border-t border-gray-300",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-900",children:"Final Average for this Class:"}),e.jsxs("span",{className:"text-base font-bold",style:{color:T.primary.red},children:[v.finalAverage,"%"]})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1 text-center",children:"(First Term Average + Second Term Average + Third Term Average) ÷ 3"})]})]}),l.length>0&&G&&e.jsxs("div",{className:"mt-8 grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-white p-6 rounded shadow",children:[e.jsx("h4",{className:"font-semibold mb-2",children:"Teacher's Remark"}),e.jsx("div",{className:"w-full border border-gray-300 rounded p-2 bg-gray-50 text-gray-700 min-h-[48px]",children:j})]}),e.jsxs("div",{className:"bg-white p-6 rounded shadow",children:[e.jsx("h4",{className:"font-semibold mb-2",children:"Principal's Remark"}),e.jsx("div",{className:"w-full border border-gray-300 rounded p-2 bg-gray-50 text-gray-700 min-h-[48px]",children:k})]})]}),l.length>0&&!G&&e.jsx("div",{className:"mt-8 bg-blue-50 border border-blue-200 rounded-md p-4",children:e.jsxs("p",{className:"text-sm text-blue-800",children:[e.jsx("strong",{children:"Note:"})," Teacher's and Principal's remarks will be available once all subjects have complete scores recorded (First CA, Second CA, and Exam scores)."]})}),e.jsxs("div",{className:"mt-8 bg-white p-6 rounded shadow max-w-xl mx-auto",children:[e.jsx("h4",{className:"font-semibold mb-2",children:"Grade Scale"}),e.jsxs("table",{className:"min-w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left",children:"Grade"}),e.jsx("th",{className:"px-4 py-2 text-left",children:"Score Range"}),e.jsx("th",{className:"px-4 py-2 text-left",children:"Remark"})]})}),e.jsx("tbody",{children:q.map((t,a)=>e.jsxs("tr",{className:a%2===0?"bg-gray-50":"",children:[e.jsx("td",{className:"px-4 py-2 font-bold",children:t.grade}),e.jsxs("td",{className:"px-4 py-2",children:[t.min," - ",t.max]}),e.jsx("td",{className:"px-4 py-2",children:t.remark})]},t.grade))})]})]})]}),l.length>0&&e.jsx("div",{className:"mt-6",children:G?e.jsxs("div",{className:"flex flex-wrap gap-4 justify-end",children:[e.jsx("button",{onClick:he,className:"px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200",children:"Print Results"}),e.jsx("button",{onClick:pe,className:"px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity duration-200",style:{backgroundColor:T.primary.red},children:"Download PDF"})]}):e.jsx("div",{className:"bg-yellow-50 border border-yellow-200 rounded-md p-4",children:e.jsxs("p",{className:"text-sm text-yellow-800",children:[e.jsx("strong",{children:"Note:"})," Download and Print options will be available once all subjects have complete scores recorded (First CA, Second CA, and Exam scores)."]})})})]})]})})};export{Le as default};
