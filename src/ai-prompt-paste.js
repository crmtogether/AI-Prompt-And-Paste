//******************************************************************************
//******************************************************************************
/*
* CRM Together - crmtogether.com (2025)
* Open Source - paste in json and the new company/person for is filled in
* install on CRM server in the "WWWRoot\js\custom" folder
* EG
*      C:\Program Files (x86)\Sage\CRM\CRM\WWWRoot\js\custom
* file name: ai-prompt-paste.js
* https://github.com/crmtogether/AI-Prompt-And-Paste
* script that creates a button and allows you paste in json generated from the prompt (defined in the readme)
*/
//******************************************************************************

document.addEventListener("DOMContentLoaded", function () {
	
	
(function () {
  console.log("script AI-Prompt-And-Paste: loading");
  act=0;
  if (crm){
	  act = crm.getArg('ACT', crm.url());
	  if (act!=140)
	  {
		  console.log("script AI-Prompt-And-Paste: act is invalid/"+act);
		  return;
	  }
  }
  // Create floating button
  const button = document.createElement("button");
  button.innerText = "Fill Form from JSON";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "10000";
  button.style.padding = "10px 15px";
  button.style.background = "#007BFF";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  if (!crm)
	document.body.appendChild(button);
  else
	crm.addButton("GenCaptions", "btnAIPromptPaste", "btnAIPromptPaste","");

  // Create modal dialog
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.5)";
  modal.style.display = "none";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "10001";

  const dialog = document.createElement("div");
  dialog.style.background = "#fff";
  dialog.style.padding = "20px";
  dialog.style.borderRadius = "8px";
  dialog.style.width = "400px";
  dialog.style.maxWidth = "90%";
  dialog.style.boxShadow = "0 0 10px rgba(0,0,0,0.25)";
  modal.appendChild(dialog);

	// Instructional span
	const instruction = document.createElement("span");
	instruction.textContent = "Paste a JSON object with field names matching form input names (e.g. comp_name, addr_country, etc.). Select fields will match visible text if exact values don't align.";
	instruction.style.display = "block";
	instruction.style.marginBottom = "8px";
	instruction.style.fontSize = "14px";
	instruction.style.color = "#333";
	instruction.style.fontWeight = "normal";
	dialog.appendChild(instruction);

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Paste JSON here";
  textarea.style.width = "100%";
  textarea.style.height = "200px";
  textarea.style.marginBottom = "10px";
  textarea.className="EDIT";
  dialog.appendChild(textarea);

  const cancelBtn = document.createElement("A");
  cancelBtn.innerText = "Cancel";
  cancelBtn.className="er_buttonItem"
  cancelBtn.style.marginRight = "20px";
  dialog.appendChild(cancelBtn);

  const submitBtn = document.createElement("A");
  submitBtn.innerText = "Apply";
  submitBtn.className="er_buttonItem"

  dialog.appendChild(submitBtn);

  document.body.appendChild(modal);

	// Instructional span
	const instruction2 = document.createElement("span");

		instruction2.textContent = 'SAMPLE PROMPT FOR YOUR LLM OF CHOICE (EG OPENAI, CLAUDE ETC): Can you lookup INSERT_URL_HERE and provide me simple json (name value) with the company name title as "comp_name" and the address broken up as "addr_address1","addr_address2","addr_address3","addr_address4", "addr_city", "addr_state", "addr_country" and email as "emai_emailaddressbusiness" and phone number as "phon_numberbusiness" and website as "comp_website"? If possible can you also get the name of a high level person who works there and fill in the details as "pers_firstname"; for their firstname and "pers_lastname" for their last name and "persEmai_EmailAddressBusiness" for their email?';

	instruction2.style.display = "block";
	instruction2.style.marginBottom = "8px";
	instruction2.style.fontSize = "14px";
	instruction2.style.color = "#333";
	instruction2.style.fontWeight = "normal";
	dialog.appendChild(instruction2);
	
  // Show dialog
  button.onclick = () => {
    textarea.value = "";
    modal.style.display = "flex";
  };
  
  var Button_btnAIPromptPaste=document.getElementById("Button_btnAIPromptPaste");
  if (Button_btnAIPromptPaste)
  {
	Button_btnAIPromptPaste.onclick = () => {
		textarea.value = "";
		modal.style.display = "flex";
	};
	Button_btnAIPromptPaste.removeAttribute("href");
	Button_btnAIPromptPaste.innerText="Fill form from JSON"

  }
  
  if (!crm)
  {
	  button.onclick = () => {
		  textarea.value = "";
		  modal.style.display = "flex";
		};
  }
  // Cancel
  cancelBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Handle submission
  submitBtn.onclick = () => {
    let data;
    try {
      data = JSON.parse(textarea.value);
    } catch (e) {
      alert("Invalid JSON");
      return;
    }

    Object.keys(data).forEach((key) => {
      const value = data[key];
      const elements = document.querySelectorAll(`[name="${key}"]`);
      elements.forEach((el) => {
        if (el.tagName === "SELECT") {
          let matched = false;
          for (let option of el.options) {
            if (
              option.value === value ||
              option.textContent.trim().toLowerCase() === String(value).trim().toLowerCase()
            ) {
              el.value = option.value;
              matched = true;
              break;
            }
          }
          if (!matched) console.warn(`No match for select: ${key} = ${value}`);
        } else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.value = value;
        }
      });
    });

    modal.style.display = "none";
  };
})();

});

