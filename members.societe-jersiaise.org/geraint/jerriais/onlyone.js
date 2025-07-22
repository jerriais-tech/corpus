window.onload=rollup;

function rollout(objMenuitem, objEvent)
{
    var iKeyCode;

    // Check if from a keyboard - non IE, but
    // irrelevant as tab doesn't trigger the 
    // keypress event in IE
    if (objEvent && objEvent.type == 'keypress')
    {
        if (objEvent.keyCode)
            iKeyCode = objEvent.keyCode;
        else if (objEvent.which)
            iKeyCode = objEvent.which;

        // If it's not the enter key or space key, 
        // pass control back to the browser
        if (iKeyCode != 13 && iKeyCode != 32)
            return true;
    }

    // Work out what we need to do
    if (objMenuitem.nextSibling.style.display == 'block')
        var strDisplay = 'none'
    else
        var strDisplay = 'block';

    // Close any nested lists that are open
    var objMenu = document.getElementById('mainnav');
    var objNested = objMenu.getElementsByTagName('ul');

    for (var i=0; i<objNested.length; i++)
        if (objNested[i].style.display == 'block')
            objNested[i].style.display = 'none';

    objMenuitem.nextSibling.style.display = strDisplay;
    
    // Keep any parent menus for this item open
    while (objMenuitem.parentNode.parentNode.id != 'mainnav')
    {
        objMenuitem = objMenuitem.parentNode.parentNode;
        objMenuitem.style.display = 'block';
    }

    // Stop the browser requesting the link
    return false;
}

function rollup()
{
    var bRollup, objLinks, objNode, objAnchor;

    // Check we're working with a DOM compliant browser
    if (document.getElementById && document.createElement)
    {
        var strLocation = window.location;

        var objMenu = document.getElementById('mainnav');

        var objNested = objMenu.getElementsByTagName('ul');

        // Hide each of the nested unordered list
        for (var i=0; i<objNested.length; i++)
        {
            // Only hide, if the current location is not found in the list
            bRollup = true;
            objLinks = objNested[i].getElementsByTagName('a');

            for (var j=0; j<objLinks.length; j++)
            {
                if (objLinks[j].href == strLocation)
                {
                    bRollup = false;

                    // Added by John Hunter
                    // remove link for current page
                    objNode = objLinks[j];
                    strContent = objNode.firstChild.data;
                    var objCurrentPage = document.createElement('strong');
                    objCurrentPage.appendChild(document.createTextNode(strContent));
                    objNode.parentNode.replaceChild(objCurrentPage, objNode);

                    // Add an id so we can keep the parents open
                    objCurrentPage.id = 'jsKeepOpen';
                }

            }

            if (bRollup == true)
                objNested[i].style.display = 'none';
            else
                objNested[i].style.display = 'block';

            // Place the top-level text in an anchor tag
            objNode = objNested[i].parentNode;

            strContent = objNode.firstChild.data;

            objAnchor = document.createElement('a');
            objAnchor.href = '#';
            objAnchor.onclick = function(event){return rollout(this, event);}
            objAnchor.onkeypress = function(event){return rollout(this, event);}
            objAnchor.appendChild(document.createTextNode(strContent));

            objNode.replaceChild(objAnchor, objNode.firstChild);
        }

        // Keep any parent menus for the current item
        if (document.getElementById('jsKeepOpen'))
        {
            var objKeepOpen = document.getElementById('jsKeepOpen');
            while (objKeepOpen.parentNode.id != 'mainnav')
            {
                objKeepOpen = objKeepOpen.parentNode;
                objKeepOpen.style.display = 'block';
            }
        }
    }
}