var nodes = null;
var edges = null;
var network = null;


var centralGravityValueDefault = 0.2; //0.0001,
springLengthValueDefault = 200;//170;//200;//127,
springConstantValueDefault = 0.05;//0.04, // 0.05
nodeDistanceValueDefault = 200;//100;//170, //120
dampingValueDefault = 0.09;//0.08 // 0,08;



// randomly create some nodes and edges
var nodes = new vis.DataSet([
  /*  {id: "Spoggy", label: 'Spoggy'},
  {id: "Solo", label: 'Solo'},
  {id: "Collaboratif", label: 'Collaboratif'},
  {id: "Explore", label: 'Explore'},
  {id: "Solid", label: 'Solid'},
  {id: "Holacratie", label: 'Holacratie'}*/
]);

// create an array with edges
var edges = new vis.DataSet([
  {from: "Spoggy", to: "Solo", arrows:'to', label: "niveau 1"},
  {from: "Spoggy", to: "Collaboratif", arrows:'to', label: "niveau 2"},
  {from: "Spoggy", to: "Explore", arrows:'to', label: "niveau 3"},
  {from: "Spoggy", to: "Solid", arrows:'to', label: "niveau 4"},
  {from: "Spoggy", to: "Holacratie", arrows:'to', label: "niveau 5"},
  {from: "Solo", to: "Collaboratif", arrows:'to', label: "suivant"},
  {from: "Collaboratif", to: "Explore", arrows:'to', label: "suivant"},
  {from: "Explore", to: "Solid", arrows:'to', label: "suivant"},
  {from: "Solid", to: "Holacratie", arrows:'to', label: "suivant"},
]);


var data = {
  nodes: nodes,
  edges: edges
};
var seed = 2;

function setDefaultLocale() {
  var defaultLocal = navigator.language;
  var select = document.getElementById('locale');
  select.selectedIndex = 0; // set fallback value
  for (var i = 0, j = select.options.length; i < j; ++i) {
    if (select.options[i].getAttribute('value') === defaultLocal) {
      select.selectedIndex = i;
      break;
    }
  }
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw(val) {
  destroy();
  nodes = [];
  edges = [];
  console.log("select",val)
  // create a network
  var container = document.getElementById('mynetwork');
  var options = {
    layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
    locale: val || "en", // document.getElementById('locale').value,
    interaction: {
      navigationButtons: true,
      //  keyboard: true, // incompatible avec le déplacement par flèches dans le champ input
      multiselect: true
    },
    edges:{
      arrows: {
        to:     {enabled: true, scaleFactor:1, type:'arrow'}
      },
      color:{
        inherit:'both',
        highlight: '#000000',
        color: '#2B7CE9'
      }
    },
    nodes:{
      color: {
        highlight: {border: '#000000', background:'#FFFFFF'}
      }
    },
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Ajouter un noeud ";
        data.label="";
        editNode(data, clearNodePopUp, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Editer un noeud ";
        editNode(data, cancelNodeEdit, callback);
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Etes-vous certain de vouloir connecter le noeud sur lui-même?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        document.getElementById('edge-operation').innerHTML = "Ajouter un lien";
        editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
          document.getElementById('edge-operation').innerHTML = "Editer un lien";
          editEdgeWithoutDrag(data,callback);
        }
      }
    }
    ,
    physics:{
      enabled: true,
      barnesHut: {
        gravitationalConstant: -1,
        centralGravity: 0.3,
        springLength: 95,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 1
      },
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 100,
        damping: 0.4,
        avoidOverlap: 0
      },
      repulsion: {
        centralGravity: centralGravityValueDefault,  //0.001, //0.001 ? A quoi sert cette valeur ?
        springLength: springLengthValueDefault,   // 220, //220 (//200 //300)
        springConstant: springConstantValueDefault, //0.01, //0.01
        nodeDistance:  nodeDistanceValueDefault, //150, //100 //350
        damping: dampingValueDefault, ///0.08

      },
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 100,
        springConstant: 0.01,
        nodeDistance: 120,
        damping: 0.09
      },
      maxVelocity: 500, //50
      minVelocity: 1, //0.1
      solver: 'repulsion',
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 100,
        onlyDynamicEdges: false//,
        //  fit: true
      },
      timestep: 0.5,
      adaptiveTimestep: true
    }
  };

  network = new vis.Network(container, data, options);

  // EVENTS on Network
  /*network.body.data.nodes.on("*", function(event, properties, senderId){
    updateEditorFromNetwork(event, properties, senderId)
  }
);
network.body.data.edges.on("*", function(event, properties, senderId){
  updateEditorFromNetwork(event, properties, senderId)
}
);*/

// JAVASCRIPT (jQuery)

// Trigger action when the contexmenu is about to be shown
/*$(document).bind("contextmenu", function (event) {

// Avoid the real one
event.preventDefault();

// Show contextmenu
$(".custom-menu").finish().toggle(100).

// In the right position (the mouse)
css({
top: event.pageY + "px",
left: event.pageX + "px"
});
});*/


// If the document is clicked somewhere
//$(document).bind("mousedown", function (e) {
network.on("click", function (e) {
  console.log(e)
  // If the clicked element is not the menu
  if (!$(e.target).parents(".custom-menu").length > 0) {
    var elems = e.nodes.length+e.edges.length;
    console.log(elems)
    if (!elems > 0){
      $(".custom-menu").hide(100);
    }
    else{
      console.log("noeud ou edge > 0")
    }
    // Hide it

  }
});


// If the menu element is clicked
$(".custom-menu li").click(function(){

  // This is the triggered action name
  switch($(this).attr("data-action")) {

    // A case for each action. Your actions here
    case "edit":
    //  var n = network.getNodeAt(params.pointer.DOM);
    //  console.log(n)
    console.log("edit :",network.current);
    network.editNode(network.current);
    break;
    case "expand":
    console.log("expand");
var params = {}
    params.source = network.current.id;
    importer(params,updateGraph)
    fitAndFocus(network.current.id)
    if(params.source.endsWith("#me")){
      updateCurrentWebId(params.source)
    }
    break;
    case "third":
    alert("third");
    break;
  }

  // Hide it AFTER the action was triggered
  $(".custom-menu").hide(100);
});

/*
network.on("oncontext", function (params) {
console.log(params)
event.preventDefault();

// Show contextmenu
$(".custom-menu").finish().toggle(100).

// In the right position (the mouse)
css({
top: event.pageY + "px",
left: event.pageX + "px"
});
params.event.preventDefault();
var n = network.getNodeAt(params.pointer.DOM);
console.log(n)
var m = document.getElementById("popup-menu");
m.style.position.top = params.pointer.DOM.y;
m.style.position.left =  params.pointer.DOM.x;
m.style.display = "block";
$(".custom-menu").finish().toggle(100);
$(".custom-menu").css({
top: ,
left:
});
});*/

network.on("selectEdge", function (params) {
  console.log('selectEdge Event:', params);
  if (params.nodes.length == 0){
    // sinon on a selectionné un noeud
    event.preventDefault();
    var networkTopOffset = document.getElementById("mynetwork").offsetTop
    var ord = event.pageY-networkTopOffset;
    console.log("ORD",ord)
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).

    // In the right position (the mouse)
    css({
      top: ord + "px",
      left: event.pageX + "px"
    });
  }
});



network.on("selectNode", function (params) {
  console.log('selectNode Event:', params);
  //var n = network.getNodeAt(params.pointer.DOM);
  //console.log(n)
  if (params.nodes.length == 1) {
    if (network.isCluster(params.nodes[0]) == true) {
      network.openCluster(params.nodes[0]);
    }else{
      let id = params.nodes[0];
      var node = network.body.data.nodes.get(id);
      console.log(node);
      network.current = node;
      node.label.indexOf(' ') >= 0 ? document.getElementById("input").value = '"'+node.label+'" ' : document.getElementById("input").value = node.label+' ';
    }

  }


  event.preventDefault();
  var networkTopOffset = document.getElementById("mynetwork").offsetTop
  var ord = event.pageY-networkTopOffset;
  console.log("ORD",ord)
  // Show contextmenu
  $(".custom-menu").finish().toggle(100).

  // In the right position (the mouse)
  css({
    top: ord + "px",
    left: event.pageX + "px"
  });


});

network.on("doubleClick", async function (params) {
  console.log('doubleClick ', params);
  var id = params.nodes[0];
  var existNode;
  try{
    existNode = network.body.data.nodes.get({
      filter: function(node){
        return (node.id == id );
      }
    });
    console.log(existNode);
    if (existNode.length != 0){
      console.log("existe", existNode[0])
      var params = existNode[0];
      params.source = existNode[0].id;
      importer(params,updateGraph)
      fitAndFocus(existNode[0].id)
      if(params.source.endsWith("#me")){
        updateCurrentWebId(params.source)
      }
      //app.nodeChanged(existNode[0]);
      //  app.agentVis.send('agentFileeditor', {type: "nodeChanged", node: existNode[0]});
      //  app.agentVis.send('agentFoldermenu', {type: "nodeChanged", node: existNode[0]});
      //  network.body.data.nodes.add(data);
      //  var thing = this.thing;
    }else{
      console.log("n'existe pas")
      //  delete data.x;
      //  delete data.y
      //  network.body.data.nodes.update(data);
    }
  }
  catch (err){
    console.log(err);
  }
});

}

function editNode(data, cancelAction, callback) {
  // recup colorpickers
  var colpicbody = document.getElementById('bodycolorpicker').cloneNode(true);
  colpicbody.id="colpicbody";
  var colpicborder = document.getElementById('bordercolorpicker').cloneNode(true);
  colpicborder.id="colpicborder"
  document.getElementById('node-operation').appendChild(colpicbody)
  document.getElementById('node-operation').appendChild(colpicborder)
  data.color && data.color.background? document.getElementById('colpicbody').value = data.color.background : "";
  data.color && data.color.border? document.getElementById('colpicborder').value = data.color.border : "";

  document.getElementById('node-id').value = data.id || "";
  document.getElementById('node-label').value = data.label;
  document.getElementById('node-shape').value = data.shape || "ellipse";
  document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
  document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
  document.getElementById('node-popUp').style.display = 'block';
  document.getElementById('node-label').onkeyup = nodeNameChanged.bind(this, data, callback);
}

// Callback passed as parameter is ignored
function clearNodePopUp() {
  document.getElementById('node-saveButton').onclick = null;
  document.getElementById('node-cancelButton').onclick = null;
  document.getElementById('node-popUp').style.display = 'none';
  document.getElementById('node-label').onkeyup = null;
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data, callback) {
  data.label = document.getElementById('node-label').value;
  console.log(document.getElementById('node-shape'))
  data.shape = document.getElementById('node-shape').value;
  console.log(data.shape)
  data.color = {};
  data.color.background = document.getElementById('colpicbody').value;
  data.color.border =  document.getElementById('colpicborder').value;
  document.getElementById('bodycolorpicker').value = document.getElementById('colpicbody').value;
  document.getElementById('bordercolorpicker').value = document.getElementById('colpicborder').value;
  var image_url = document.getElementById('node-image-url').value || "";
  if (data.shape == "image" || data.shape == "circularImage" && image_url.length > 0){
    data.image = image_url;
  }

  console.log(data)
  fitAndFocus(data.id)
  clearNodePopUp();
  callback(data);
}

function nodeNameChanged(data, callback) {
  if(event.key === 'Enter') {
    event.preventDefault();
    //  document.getElementById("valider").click();
    saveNodeData(data, callback)
  }
}

function edgeNameChanged(data, callback) {
  if(event.key === 'Enter') {
    event.preventDefault();
    //  document.getElementById("valider").click();
    saveEdgeData(data, callback)
  }
}

function editEdgeWithoutDrag(data, callback) {
  // filling in the popup DOM elements
  document.getElementById('edge-label').value = data.label || "";
  document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
  document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
  document.getElementById('edge-popUp').style.display = 'block';
  document.getElementById('edge-label').onkeyup = edgeNameChanged.bind(this, data, callback);
}

function clearEdgePopUp() {
  document.getElementById('edge-saveButton').onclick = null;
  document.getElementById('edge-cancelButton').onclick = null;
  document.getElementById('edge-label').onkeyup = null;
  document.getElementById('edge-popUp').style.display = 'none';

}

function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}

function saveEdgeData(data, callback) {
  if (typeof data.to === 'object')
  data.to = data.to.id
  if (typeof data.from === 'object')
  data.from = data.from.id
  data.label = document.getElementById('edge-label').value;
  data.color = {};
  data.color.inherit='both';
  clearEdgePopUp();
  callback(data);
}

function initGraph() {
//  setDefaultLocale();
  draw();
  setDefaultReglages();
  var popupCont = document.getElementById("popup-container");
//  document.getElementById("mynetwork").appendChild(popupCont);
}

function fitAndFocus(node_id){
  console.log("Fonctionnement erratique de fitAndFocus, suspendu pour l'instant")
  var network = this.network;
  var oneStab = true;
  this.network.on("stabilized", function(params){
    //http://visjs.org/docs/network/index.html?keywords=fit
    console.log(params)
    /*  if (oneStab){
    oneStab = false;
    autofit.checked? network.fit(): "";
    var options = {
    scale: 1,
    offset: {x:1, y:1},
    //  locked: true,
    animation: { // -------------------> can be a boolean too!
    duration: 1000,
    easingFunction: "easeInOutQuad"
  }
};
autofocus.checked? network.focus(node_id, options): "";

}else{
console.log("other stab")
}*/
});
}

function updateGraph(message){
  console.log("update graph"/*,message*/);
  var app =this;
  if (message.params!= undefined && message.params.remplaceNetwork){
    this.network.body.data.nodes.clear();
    this.network.body.data.edges.clear();
  }
  //this.network.body.data.nodes.update(message.data.nodes)
  //this.network.body.data.edges.update(message.data.edges)
  addResultsToGraph(this.network, message.data)
  //  this.network.fit();
  //  this.network.redraw();
  //  console.log("add results to graph"/*,this.network*/)
}

function addResultsToGraph(network, results){
  var app = this;
  var nodes = results.nodes;
  var edges = results.edges;
  //DESACTIVATION STABIL POUR PLUS DE FLUIDITE
  var options = {
    physics:{
      stabilization: false
    },
    edges: {
      smooth: {
        type: "continuous",
        forceDirection: "none"
      }
    }
  }
  app.network.setOptions(options);

  nodes.forEach(function(n){
    app.addNodeIfNotExist(app.network, n);
  });
  app.network.body.data.edges.update(edges)
  //REACTIVATION STABIL POUR PLUS DE FLUIDITE
  options = {
    physics:{
      stabilization: true
    }
  }
  app.network.setOptions(options);
  //app.network.redraw();
}

function addNodeIfNotExist(network, data){
  var existNode = false;
  //console.log(data);
  var nodeId;
  try{
    existNode = network.body.data.nodes.get({
      filter: function(n){
        return (n.id == data.id || (n.label == data.label)); //  || n.title == data.label
      }
    });
    //console.log(existNode);
    if (existNode.length == 0){
      //  console.log("n'existe pas")
      nodeId =   network.body.data.nodes.add(data)[0];
    }else{
      //  console.log("existe")
      delete data.x;
      delete data.y
      nodeId =  network.body.data.nodes.update(data)[0];
    }
  }
  catch (err){
    console.log(err);
  }
}

function clusterByCid() {
  network.setData(data);
  var clusterOptionsByData = {
    joinCondition:function(childOptions) {
      return childOptions.cid == 1;
    },
    clusterNodeProperties: {id:'cidCluster', label:"Navigation", color:"red", borderWidth:3, shape:'star'}
  };
  network.cluster(clusterOptionsByData);
}
function clusterByColor() {
  network.setData(data);
  var colors = ['orange','lime','DarkViolet'];
  var clusterOptionsByData;
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    clusterOptionsByData = {
      joinCondition: function (childOptions) {
        return childOptions.color.background == color; // the color is fully defined in the node.
      },
      processProperties: function (clusterOptions, childNodes, childEdges) {
        var totalMass = 0;
        for (var i = 0; i < childNodes.length; i++) {
          totalMass += childNodes[i].mass;
        }
        clusterOptions.mass = totalMass;
        return clusterOptions;
      },
      clusterNodeProperties: {id: 'cluster:' + color, borderWidth: 3, shape: 'database', color:color, label:'color:' + color}
    };
    network.cluster(clusterOptionsByData);
  }
}
function clusterByConnection() {
  network.setData(data);
  network.clusterByConnection(1)
}
function clusterOutliers() {
  network.setData(data);
  network.clusterOutliers();
}
function clusterByHubsize() {
  network.setData(data);
  var clusterOptionsByData = {
    processProperties: function(clusterOptions, childNodes) {
      clusterOptions.label = "[" + childNodes.length + "]";
      return clusterOptions;
    },
    clusterNodeProperties: {borderWidth:3, shape:'box', font:{size:30}}
  };
  network.clusterByHubsize(undefined, clusterOptionsByData);
}

function reglage(id,value){
  //  console.log(id,value);
  switch(id) {
    case "distance":
    network.physics.options.repulsion.nodeDistance = value
    break;
    case "force":
    network.physics.options.repulsion.springConstant = value
    break;
    case "longueur":
    network.physics.options.repulsion.springLength = value
    break;
    case "gravite":
    network.physics.options.repulsion.centralGravity = value
    break;
    case "resistance":
    network.physics.options.repulsion.damping = value
    break;
    default:
    console.log("problème",id,value)
  }
  network.stabilize(10);
}


function setDefaultReglages(){
/*  document.getElementById("distance").value = nodeDistanceValueDefault;
  document.getElementById("force").value = springConstantValueDefault;
  document.getElementById("longueur").value = springLengthValueDefault;
  document.getElementById("gravite").value = centralGravityValueDefault;
  document.getElementById("resistance").value = dampingValueDefault;*/
  reglage("distance",nodeDistanceValueDefault)
  reglage("force",springConstantValueDefault)
  reglage("longueur",springLengthValueDefault)
  reglage("gravite",centralGravityValueDefault)
  reglage("resistance",dampingValueDefault)
}

function toggleNavigation(){
  console.log("toogleNavigation")
  var data = network.body.data;
  console.error(data)
}
