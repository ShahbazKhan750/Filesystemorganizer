(function(){
    let btnaddfolder=document.querySelector("#addfolder");
    let btnaddtextfile=document.querySelector("#addtextfile");
    let btnaddAlbum=document.querySelector("#addAlbum");

    let divbreadcrumb=document.querySelector("#breadcrumb");
    let arootpath= divbreadcrumb.querySelector("a[purpose='path']");
    let divcontainer=document.querySelector("#container");

    let divapp=document.querySelector("#app");
    let divapptitlebar=divapp.querySelector("#app-title-bar");
    let divapptitle=divapp.querySelector("#app-title");
    let divappmenu=divapp.querySelector("#app-menu-bar");
    let divaapbody=divapp.querySelector("#app-body");
    let divappclose=document.querySelector("#app-close");

    let divtemplate=document.querySelector("#templates");
    let resources=[];
    let cfid=-1;
    let rid=0;

    btnaddfolder.addEventListener("click",AddFolder);
    btnaddtextfile.addEventListener("click",AddTextFile);
    btnaddAlbum.addEventListener("click",addAlbum);

    arootpath.addEventListener("click",viewFolderFrompath);
    divappclose.addEventListener("click",closeApp);

    function closeApp(){
        divapptitle.innerHTML="title will come here";
        divapptitle.setAttribute("rid", "");
        divappmenu.innerHTML="";
        divaapbody.innerHTML="";
    }

    function AddFolder(){
        let rname=prompt("enter the folder name");
            if(rname!=null){
                rname=rname.trim();
            }
        if(!rname){//empty name validation
            alert("resource name is required");
            return;
        }
    
        //uniqueness validation
        let alreadyexist=resources.some(r=>r.rname==rname&&r.pid==cfid);
        if(alreadyexist==true){
            alert("this name is already exist,try another name");
            return;
        }
        let pid=cfid;
        rid++;
           AddFolderToHTML(rname,rid,pid);

           resources.push({
             rid:rid,
             rname:rname,
             rtype:"folder",
             pid:cfid
           });

           SaveToLocalStorage();
        
    }

    function AddFolderToHTML(rname,rid,pid){
        let foldertemplate=divtemplate.content.querySelector(".folder");
        let divfolder=document.importNode(foldertemplate,true);
        
        let spandelete=divfolder.querySelector("[action=delete]");
        let spanrename=divfolder.querySelector("[action=rename]");
        let spanview=divfolder.querySelector("[action=view]");
        let divname=divfolder.querySelector("[purpose=name]");

        spandelete.addEventListener("click",DeleteFolder);
        spanrename.addEventListener("click",RenameFolder);
        spanview.addEventListener("click",ViewFolder);

         divname.innerHTML=rname;
         divfolder.setAttribute("rid", rid);
         divfolder.setAttribute("pid",pid);
        divcontainer.appendChild(divfolder);
    }

    function AddTextFile(){
        
        let rname=prompt("enter the folder name");
            if(rname!=null){
                rname=rname.trim();
            }
        if(!rname){//empty name validation
            alert("resource name is required");
            return;
        }
    
        //uniqueness validation
        let alreadyexist=resources.some(r=>r.rname==rname&&r.pid==cfid);
        if(alreadyexist==true){
            alert("this name is already exist,try another name");
            return;
        }
        let pid=cfid;
        rid++;
           AddtextfileToHTML(rname,rid,pid);



           resources.push({
             rid:rid,
             rname:rname,
             rtype:"text-file",
             pid:cfid,
             isBold: true,
             isItalic:false,
             isUnderline:false,
             bgcolor:"#000000",
             textColor:"#FFFFFF",
             fontFamily:"serif",
             fontSize: 12,
             content:"i am a new file"

           });

           SaveToLocalStorage();
    }

    function addAlbum(){
        
        let rname=prompt("enter the Album name");
            if(rname!=null){
                rname=rname.trim();
            }
        if(!rname){//empty name validation
            alert("resource name is required");
            return;
        }
    
        //uniqueness validation
        let alreadyexist=resources.some(r=>r.rname==rname&&r.pid==cfid);
        if(alreadyexist==true){
            alert("this name is already exist,try another name");
            return;
        }
        let pid=cfid;
        rid++;
           AddAlbumToHTML(rname,rid,pid);



           resources.push({
             rid:rid,
             rname:rname,
             rtype:"album",
             pid:cfid
           });

           SaveToLocalStorage();
    }

    function AddtextfileToHTML(rname,rid,pid){
        let textfiletemplate=divtemplate.content.querySelector(".textfile");
        let divtextfile=document.importNode( textfiletemplate,true);
        
        let spandelete=divtextfile.querySelector("[action=delete]");
        let spanrename=divtextfile.querySelector("[action=rename]");
        let spanview=divtextfile.querySelector("[action=view]");
        let divname=divtextfile.querySelector("[purpose=name]");

        spandelete.addEventListener("click",DeleteTextFile);
        spanrename.addEventListener("click",RenameTextFile);
        spanview.addEventListener("click",ViewTextFile);

         divname.innerHTML=rname;
         divtextfile.setAttribute("rid", rid);
         divtextfile.setAttribute("pid",pid);
        divcontainer.appendChild(divtextfile);
    }

    function AddAlbumToHTML(rname,rid,pid){
        let Albumtemplate=divtemplate.content.querySelector(".Album");
        let divalbum=document.importNode( Albumtemplate,true);
        
        let spandelete=divalbum.querySelector("[action=delete]");
        let spanrename=divalbum.querySelector("[action=rename]");
        let spanview=divalbum.querySelector("[action=view]");
        let divname=divalbum.querySelector("[purpose=name]");

        spandelete.addEventListener("click",DeleteAlbum);
        spanrename.addEventListener("click",RenameAlbum);
        spanview.addEventListener("click",ViewAlbum);

         divname.innerHTML=rname;
         divalbum.setAttribute("rid", rid);
         divalbum.setAttribute("pid",pid);
        divcontainer.appendChild(divalbum);
    }

    function DeleteFolder(){

        let divfolder=this.parentNode;
        let divname=divfolder.querySelector("[purpose='name']");
        let fidtbd=divfolder.getAttribute("rid");
        let fname=divname.innerHTML;

        let childrenexist=resources.some(r=>r.pid==fidtbd);
        let flag=confirm('Are you sure you want to delete ${fname}?'+(childrenexist?"it also has children":""));

        if(!flag){
            return;
        }
        //html
        divcontainer.removeChild(divfolder);
        //ram
        deleteHelper(fidtbd);
        //storage
        SaveToLocalStorage();

    
    }
    
    function deleteHelper(fidtbd){
        let children=resources.filter(r=>r.pid==fidtbd);
        for(let i=0;i<children.length;i++){
            deleteHelper(children[i].rid);
        }

        let ridx=resources.findIndex(r=>r.rid==fidtbd);

        resources.splice(ridx,1);
    }

    function DeleteTextFile(){
        let divtextfile=this.parentNode;
        let divname=divtextfile.querySelector("[purpose='name']");
        let fidtbd=divtextfile.getAttribute("rid");
        let fname=divname.innerHTML;

        let flag=confirm("Are you sure do to delete this file"+fname);

        if(!flag){
            return;
        }
        //html
        divcontainer.removeChild(divtextfile);
        //ram
        let ridx=resources.findIndex(r=>r.rid==fidtbd);
        resources.splice(ridx,1);
        //storage
        SaveToLocalStorage();
    }

   function DeleteAlbum(){
        let divAlbum=this.parentNode;
        let divname=divAlbum.querySelector("[purpose='name']");
        let fidtbd=divAlbum.getAttribute("rid");
        let fname=divname.innerHTML;

        let flag=confirm("Are you sure do to delete this album"+fname);

        if(!flag){
            return;
        }
        //html
        divcontainer.removeChild(divAlbum);
        //ram
        let ridx=resources.findIndex(r=>r.rid==fidtbd);
        resources.splice(ridx,1);
        //storage
        SaveToLocalStorage();
    }
    

    function RenameFolder(){
        let nrname=prompt("enter the folder name");
        if(nrname!=null){
            nrname=nrname.trim();
        }
        if(!nrname){//empty name validation
             alert("resource name is required");
               return;
        }

        let divfolder=this.parentNode;
        let divname=divfolder.querySelector("[purpose=name]");
        let orname=divname.innerHTML;
        let ridTBU=parseInt(divfolder.getAttribute("rid"));

        if(orname==nrname){
            alert("please enter new name");
            return;
        }
        
        let alreadyexist=resources.some(r=>r.rname==nrname&&r.pid==cfid);
        if(alreadyexist==true){
             alert(nrname+"already exists");
             return;
        }
        //change html
        divname.innerHTML=nrname;
        //change ram
        let folder=resources.find(r=>r.rid==ridTBU);
        folder.rname=nrname;

        SaveToLocalStorage();

    }

    function RenameTextFile(){
        let nrname=prompt("enter the file name");
        if(nrname!=null){
            nrname=nrname.trim();
        }
        if(!nrname){//empty name validation
             alert("resource name is required");
               return;
        }

        let divtextfile=this.parentNode;
        let divname=divtextfile.querySelector("[purpose=name]");
        let orname=divname.innerHTML;
        let ridTBU=parseInt(divtextfile.getAttribute("rid"));

        if(orname==nrname){
            alert("please enter new name");
            return;
        }
        
        let alreadyexist=resources.some(r=>r.rname==nrname&&r.pid==cfid);
        if(alreadyexist==true){
             alert(nrname+"already exists");
             return;
        }
        //change html
        divname.innerHTML=nrname;
        //change ram
        let folder=resources.find(r=>r.rid==ridTBU);
        folder.rname=nrname;

        SaveToLocalStorage();
    }

   function RenameAlbum(){
        let nrname=prompt("enter the folder name");
        if(nrname!=null){
            nrname=nrname.trim();
        }
        if(!nrname){//empty name validation
             alert("resource name is required");
               return;
        }

        let divAlbum=this.parentNode;
        let divname=divAlbum.querySelector("[purpose=name]");
        let orname=divname.innerHTML;
        let ridTBU=parseInt(divAlbum.getAttribute("rid"));

        if(orname==nrname){
            alert("please enter new name");
            return;
        }
        
        let alreadyexist=resources.some(r=>r.rname==nrname&&r.pid==cfid);
        if(alreadyexist==true){
             alert(nrname+"already exists");
             return;
        }
        //change html
        divname.innerHTML=nrname;
        //change ram
        let album=resources.find(r=>r.rid==ridTBU);
        album.rname=nrname;

        SaveToLocalStorage();

    }
    

    function ViewFolder(){
      let divfolder=this.parentNode;
      let divname=divfolder.querySelector("[purpose='name']");

      let rfname=divname.innerHTML;
      let fid=parseInt(divfolder.getAttribute("rid"));

      let apathtemplate=divtemplate.content.querySelector("a[purpose='path']");
      let apath=document.importNode(apathtemplate,true);

      apath.innerHTML=rfname;
      apath.setAttribute("rid",fid);
      apath.addEventListener("click", viewFolderFrompath);
      divbreadcrumb.appendChild(apath);

      cfid=fid;
      divcontainer.innerHTML="";

      for(let i=0;i<resources.length;i++){
        if(resources[i].pid==cfid){
            if(resources[i].rtype=="folder"){
              AddFolderToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
          }else if(resources[i].rtype=="text-file"){
              AddtextfileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
          }else if(resources[i].rtype=="album"){
            AddAlbumToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
        }

        }
    }

   }


   function viewFolderFrompath(){
        let apath=this;
        let fid=parseInt(apath.getAttribute("rid"));

        while(apath.nextSibling){
            apath.parentNode.removeChild(apath.nextSibling);
        }

        cfid=fid;
        divcontainer.innerHTML="";
  
        for(let i=0;i<resources.length;i++){
            if(resources[i].pid==cfid){
                if(resources[i].rtype=="folder"){
                  AddFolderToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
              }else if(resources[i].rtype=="text-file"){
                  AddtextfileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
              }else if(resources[i].rtype=="album"){
                AddAlbumToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            }
          }
      } 
    }
    
    function ViewTextFile(){
       let divtextfile=this.parentNode;
       let divname=divtextfile.querySelector("[purpose='name']");
       let fname=divname.innerHTML;
       let fid=parseInt(divtextfile.getAttribute("rid"));

       let divnotepadmenutemplate= divtemplate.content.querySelector("[purpose='notepad-menu']");
       let divnotepadmenu=document.importNode(divnotepadmenutemplate,true);
       divappmenu.innerHTML="";
       divappmenu.appendChild(divnotepadmenu);

       let divnotepadbodytemplate= divtemplate.content.querySelector("[purpose='notepad-body']");
       let divnotepadbody=document.importNode( divnotepadbodytemplate,true);
       divaapbody.innerHTML="";
       divaapbody.appendChild( divnotepadbody);
  
       divapptitle.innerHTML=fname;
       divapptitle.setAttribute("rid", fid);

       let spansave=divappmenu.querySelector("[action='save']");
       let spanbold=divappmenu.querySelector("[action='bold']");
       let spanitalic=divappmenu.querySelector("[action='italic']");
       let spanunderline=divappmenu.querySelector("[action='underline']");
       let inputbgcolor=divappmenu.querySelector("[action='bg-color']");
       let inputtextcolor=divappmenu.querySelector("[action='fg-color']");
       let selectfontfamily=divappmenu.querySelector("[action='font-family']");
       let selectfontsize=divappmenu.querySelector("[action='font-size']");
       let spandownload=divappmenu.querySelector("[action='download']");
       let spanupload=divappmenu.querySelector("[action='forupload']");
       let inputupload=divappmenu.querySelector("[action='upload']");
       let textArea=divaapbody.querySelector("textArea");

       spansave.addEventListener("click",Savenotepad);
       spanbold.addEventListener("click",Makenotepadbold);
       spanitalic.addEventListener("click",Makenotepaditalic);
       spanunderline.addEventListener("click",Makenotepadunderline);
       spandownload.addEventListener("click",downloadNotepad);
       inputupload.addEventListener("change",uploadNodepad);
       inputbgcolor.addEventListener("change",Changenotepadbgcolor);
       inputtextcolor.addEventListener("change",Changenotepadtextcolor);
       selectfontfamily.addEventListener("change",Changenotepadfontfamily);
       selectfontsize.addEventListener("change",Changenotepadfontsize);
       spanupload.addEventListener("click",function(){
               inputupload.click();
       });

       let resource=resources.find(r=>r.rid==fid);
       spanbold.setAttribute("pressed",!resource.isBold);
       spanitalic.setAttribute("pressed",!resource.isItalic);
       spanunderline.setAttribute("pressed",!resource.isUnderline);
       inputbgcolor.value=resource.bgcolor;
       inputtextcolor.value=resource.textColor;
       selectfontfamily.value=resource.fontFamily;
       selectfontsize.value=resource.fontSize;
       textArea.value=resource.content;

       spanbold.dispatchEvent(new Event("click"));
       spanitalic.dispatchEvent(new Event("click"));
       spanunderline.dispatchEvent(new Event("click"));
       inputbgcolor.dispatchEvent(new Event("change"));
       inputtextcolor.dispatchEvent(new Event("change"));
       selectfontfamily.dispatchEvent(new Event("change"));
       selectfontsize.dispatchEvent(new Event("change"));

    }

    function ViewAlbum(){
        let divalbum=this.parentNode;
        let divname=divalbum.querySelector("[purpose='name']");
        let fname=divname.innerHTML;
        let fid=parseInt(divalbum.getAttribute("rid"));
 
        let divalbummenutemplate= divtemplate.content.querySelector("[purpose='album-menu']");
        let divalbummenu=document.importNode(divalbummenutemplate,true);
        divappmenu.innerHTML="";
        divappmenu.appendChild(divalbummenu);
 
        let divalbumbodytemplate= divtemplate.content.querySelector("[purpose='album-body']");
        let divalbumbody=document.importNode( divalbumbodytemplate,true);
        divaapbody.innerHTML="";
        divaapbody.appendChild(divalbumbody);
   
        divapptitle.innerHTML=fname;
        divapptitle.setAttribute("rid", fid);

        let spanadd=divalbummenu.querySelector("[action=add]");
        spanadd.addEventListener("click",addpictureToAlbum);
    }

    function addpictureToAlbum(){
      let iurl=prompt("enter an image url");
        if(iurl==null){
            return;
        }
      let img=document.createElement("img");
      img.setAttribute("src",iurl);
      img.addEventListener("click",showpictureInMain);

      let divpicturelist=divaapbody.querySelector(".picture-list");
      divpicturelist.appendChild(img);
    }

    function showpictureInMain(){
        let divpictureMainImg=divaapbody.querySelector(".picture-main > img");
        divpictureMainImg.setAttribute("src",this.getAttribute("src"));
  
        let divpicturelist=divaapbody.querySelector(".picture-list");
        let imgs=divpicturelist.querySelectorAll("img");

          for(let i=0;i<imgs.length;i++){
              imgs[i].setAttribute("pressed",false);
          }

        this.setAttribute("pressed",true);
    }

    function downloadNotepad(){
        let fid=parseInt(divapptitle.getAttribute("rid"));
        let resource=resources.find(r=>r.rid==fid);
        let divNodepadmenu=this.parentNode;

        let strforDownload=JSON.stringify(resource);
        let encodeddata=encodeURIComponent(strforDownload);

        let aDownload=divNodepadmenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href","data:text/json;charset=utf-8,"+encodeddata);
        aDownload.setAttribute("download",resource.rname +".json");

        aDownload.click();
    }

    function uploadNodepad(){
        let file=window.event.target.files[0];
        let reader=new FileReader();

        reader.addEventListener("load",function(){
            let data=window.event.target.result;
            let resource=JSON.parse(data);

       let spanbold=divappmenu.querySelector("[action='bold']");
       let spanitalic=divappmenu.querySelector("[action='italic']");
       let spanunderline=divappmenu.querySelector("[action='underline']");
       let inputbgcolor=divappmenu.querySelector("[action='bg-color']");
       let inputtextcolor=divappmenu.querySelector("[action='fg-color']");
       let selectfontfamily=divappmenu.querySelector("[action='font-family']");
       let selectfontsize=divappmenu.querySelector("[action='font-size']");
       let textArea=divaapbody.querySelector("textArea");

       spanbold.setAttribute("pressed",!resource.isBold);
       spanitalic.setAttribute("pressed",!resource.isItalic);
       spanunderline.setAttribute("pressed",!resource.isUnderline);
       inputbgcolor.value=resource.bgcolor;
       inputtextcolor.value=resource.textColor;
       selectfontfamily.value=resource.fontFamily;
       selectfontsize.value=resource.fontSize;
       textArea.value=resource.content;

       spanbold.dispatchEvent(new Event("click"));
       spanitalic.dispatchEvent(new Event("click"));
       spanunderline.dispatchEvent(new Event("click"));
       inputbgcolor.dispatchEvent(new Event("change"));
       inputtextcolor.dispatchEvent(new Event("change"));
       selectfontfamily.dispatchEvent(new Event("change"));
       selectfontsize.dispatchEvent(new Event("change"));       

        });

        reader.readAsText(file);

    }

    function Savenotepad(){
        let fid=parseInt(divapptitle.getAttribute("rid"));
        let resource=resources.find(r=>r.rid==fid);
         
        
        let spanbold=divappmenu.querySelector("[action='bold']");
        let spanitalic=divappmenu.querySelector("[action='italic']");
        let spanunderline=divappmenu.querySelector("[action='underline']");
        let inputbgcolor=divappmenu.querySelector("[action='bg-color']");
        let inputtextcolor=divappmenu.querySelector("[action='fg-color']");
        let selectfontfamily=divappmenu.querySelector("[action='font-family']");
        let selectfontsize=divappmenu.querySelector("[action='font-size']");
        let textArea=divaapbody.querySelector("textArea");

        resource.isBold=spanbold.getAttribute("pressed")=="true";
        resource.isItalic=spanitalic.getAttribute("pressed")=="true";
        resource.isUnderline= spanunderline.getAttribute("pressed")=="true";
        resource.bgcolor=inputbgcolor.value;
        resource.textColor=inputtextcolor.value;
        resource.fontFamily=selectfontfamily.value;
        resource.fontSize=selectfontsize.value;
        resource.content=textArea.value;
         
        SaveToLocalStorage();

    }

    function Makenotepadbold(){
       let textarea=divaapbody.querySelector("textArea");
       let ispressed=this.getAttribute("pressed")=="true";

       if(ispressed==false){
        this.setAttribute("pressed",true);
        textarea.style.fontWeight="bold";
       }
       else{
        this.setAttribute("pressed",false);
        textarea.style.fontWeight="normal ";
       }
    }

    function Makenotepaditalic(){
        let textarea=divaapbody.querySelector("textArea");
        let ispressed=this.getAttribute("pressed")=="true";
 
        if(ispressed==false){
         this.setAttribute("pressed",true);
         textarea.style.fontStyle="italic";
        }
        else{
         this.setAttribute("pressed",false);
         textarea.style.fontStyle="normal";
        }
    }
    
    function Makenotepadunderline(){
        let textarea=divaapbody.querySelector("textArea");
       let ispressed=this.getAttribute("pressed")=="true";

       if(ispressed==false){
        this.setAttribute("pressed",true);
        textarea.style.textDecoration="underline";
       }
       else{
        this.setAttribute("pressed",false);
        textarea.style.textDecoration="none";
       }
    }

    function Changenotepadbgcolor(){
         let color=this.value;
         let textarea=divaapbody.querySelector("textArea");
         textarea.style.backgroundColor=color;
    }

    function Changenotepadtextcolor(){
        let color=this.value;
        let textarea=divaapbody.querySelector("textArea");
        textarea.style.color=color;
    }

    function Changenotepadfontfamily(){
        let fontFamily=this.value;
        let textarea=divaapbody.querySelector("textArea");
        textarea.style.fontFamily=fontFamily;
    }

    function Changenotepadfontsize(){
        let fontSize=this.value;
        let textarea=divaapbody.querySelector("textArea");
        textarea.style.fontSize=fontSize;
    }

    function SaveToLocalStorage(){
         let rfjson=JSON.stringify(resources);
         localStorage.setItem("data", rfjson);
    }

    function LoadFromStroage(){
         let rjson=localStorage.getItem("data");

         if(!rjson){
            return;
         }
            resources=JSON.parse(rjson);
            for(let i=0;i<resources.length;i++){
                if(resources[i].pid==cfid){
                  if(resources[i].rtype=="folder"){
                    AddFolderToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }else if(resources[i].rtype=="text-file"){
                    AddtextfileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
                else if(resources[i].rtype=="album"){
                    AddAlbumToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
            } 

                if(resources[i].rid>rid){
                    rid=resources[i].rid;
                }
            }
         
    }

    LoadFromStroage();
})();