  function browserCheck()
  {
    return (((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) >= 3 )) || ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4 )))
  }
  
  function registerToggleImage(_imgRefName,_imgSrc)
  {
    if (!browserCheck)
	  return  
    document.imgRefArray[_imgRefName] = new Image()  ; 
    document.imgRefArray[_imgRefName].src = _imgSrc;
  }

  function toggle(_imgName,_state)
  {
    if (!browserCheck)
	  return  
    if (_state == 0)
    {
      if (document.lastToggledImage != null)
        document.lastToggledImage.src = document.lastToggledImageSource;
      document.lastToggledImage = null;
      document.lastToggledImageSource = '';
    }
    if (_state == 1)
    {
      if (document.lastToggledImage != null)
        document.lastToggledImage.src = document.lastToggledImageSource;
      document.lastToggledImage = document.images[_imgName];
      document.lastToggledImageSource = document.images[_imgName].src;
      document.images[_imgName].src  = document.imgRefArray[_imgName].src;
    }

  }

