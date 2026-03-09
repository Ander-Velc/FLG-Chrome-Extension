const output = document.getElementById("output")

function clear(){
output.innerHTML=""
}

function copy(text){
navigator.clipboard.writeText(text)
showToast("Copied ✔")
}

function showToast(text){

const toast=document.createElement("div")
toast.className="toast"
toast.textContent=text

document.body.appendChild(toast)

setTimeout(()=>toast.remove(),1500)
}

function randomString(length){

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const array=new Uint8Array(length)

crypto.getRandomValues(array)

let result=""

for(let i=0;i<length;i++){
result+=chars[array[i]%chars.length]
}

return result
}

function generatePassword(length=20){

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+="
const array=new Uint8Array(length)

crypto.getRandomValues(array)

let pass=""

for(let i=0;i<length;i++){
pass+=chars[array[i]%chars.length]
}

return pass
}

function createResultRow(label,value,clickAction){

const row=document.createElement("div")
row.className="resultRow"

const l=document.createElement("span")
l.className="label"
l.textContent=label

const v=document.createElement("span")
v.className="value"
v.textContent=value

row.appendChild(l)
row.appendChild(v)

if(clickAction){
row.onclick=()=>clickAction(value)
row.classList.add("clickable")
}

output.appendChild(row)
}

function createLinkRow(label,value,url){

const row=document.createElement("div")
row.className="resultRow clickable"

const l=document.createElement("span")
l.className="label"
l.textContent=label

const v=document.createElement("span")
v.className="value link"
v.textContent=value

row.appendChild(l)
row.appendChild(v)

row.onclick=()=>window.open(url)

output.appendChild(row)
}

function displayPhoneNumbers(){

clear()

const numbers=[
"34683466361",
"34699408364",
"34676784008",
"34628152325",
"34696845618",
"447985618978",
"447931082238",
"447931082241",
"447984854063",
"447498579857",
"447304250183",
"447949338055",
"447367211583",
"447475355392",
"447475352330",
"447598328056",
"447367524129",
"2348153353131",
"4915211094215",
"4915210899596",
"385919831698",
"385917370284",
"385915982071",
"559551583801"
]

numbers.forEach(n=>{
createResultRow("PHONE",n,copy)
})
}

async function getPhoneMessages(phone,last=3){

clear()

const res=await fetch(`https://receive-smss.com/sms/${phone}/`)
const html=await res.text()

const parser=new DOMParser()
const doc=parser.parseFromString(html,"text/html")

const rows=[...doc.querySelectorAll(".row.message_details")]

rows.slice(0,last).forEach(row=>{

const div=document.createElement("div")
div.className="sms"

div.textContent=row.innerText.trim()

output.appendChild(div)

})

}

async function getMailboxMessages(mail){

clear()

const res=await fetch(`https://api.catchmail.io/api/v1/mailbox?address=${mail}`)
const data=await res.json()

createResultRow("MAILBOX",mail,copy)

data.messages.forEach(msg=>{

const div=document.createElement("div")
div.className="mail"

div.textContent=`${msg.from} → ${msg.subject}`

output.appendChild(div)

})

}

function createMail(user){

clear()

const domains=[
"@catchmail.io",
"@zeppost.com",
"@mailistry.com"
]

const domain=domains[Math.floor(Math.random()*domains.length)]

const mail=user+domain

const domainURL=domain.replace("@","")

const url=`https://catchmail.io/mailbox/${domainURL}/${user}`

createResultRow("USER",user,copy)

createResultRow("MAIL",mail,copy)

createLinkRow("OPEN MAILBOX","OPEN",url)

return mail
}

function fullLogin(){

clear()

const phones=[
"34683466361",
"34699408364",
"34676784008",
"34628152325",
"34696845618",
"447985618978",
"447931082238",
"447931082241",
"447984854063",
"447498579857",
"447304250183",
"447949338055",
"447367211583",
"447475355392",
"447475352330",
"447598328056",
"447367524129",
"2348153353131",
"4915211094215",
"4915210899596",
"385919831698",
"385917370284",
"385915982071",
"559551583801"
]

const phone=phones[Math.floor(Math.random()*phones.length)]

const user=randomString(25)

const mail=createMail(user)

const pass=generatePassword()

createResultRow("PASSWORD",pass,copy)

createResultRow("PHONE",phone,copy)

}

document.getElementById("phones").onclick=displayPhoneNumbers

document.getElementById("checkSMS").onclick=()=>{

const phone=document.getElementById("phoneInput").value
const count=document.getElementById("msgCount").value||3

getPhoneMessages(phone,count)

}

document.getElementById("createMail").onclick=()=>{

const user=document.getElementById("mailUser").value||randomString(12)

createMail(user)

}

document.getElementById("checkMail").onclick=()=>{

const mail=document.getElementById("mailCheck").value

getMailboxMessages(mail)

}

document.getElementById("genPass").onclick=()=>{

clear()

const len=document.getElementById("passLen").value||20

const pass=generatePassword(len)

createResultRow("PASSWORD",pass,copy)

}

document.getElementById("fullLogin").onclick=fullLogin