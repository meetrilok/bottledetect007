$(document).ready(function() {

  var dropContainer = document.getElementById('drop-container');
  dropContainer.ondragover = dropContainer.ondragend = function() {
    return false;
  };
var imagefile=null;

  dropContainer.ondrop = function(e) {
    e.preventDefault();
	imagefile=e.dataTransfer.files[0];
    loadImage(e.dataTransfer.files[0])
  }

  $("#browse-button").change(function() {
    loadImage($("#browse-button").prop("files")[0]);
  });

  $('.modal').modal({
    dismissible: false,
    ready: function(modal, trigger) {
      $.ajax({
        type: "POST",
        url: '/classify_image/classify/api/',
        data: {
          'image64': $('#img-card').attr('src')
        },
        dataType: 'text',
        success: function(data) {
          loadStats(data)
        }
      }).always(function() {
        modal.modal('close');
      });
    }
  });

  $('#go-back, #go-start').click(function() {
    $('#img-card').removeAttr("src");
    $('#stat-table').html('');
    switchCard(0);
  });

  $('#upload-button').click(function() {
    $('.modal').modal('open');
  });
});

switchCard = function(cardNo) {
  var containers = [".dd-container", ".uf-container", ".dt-container"];
  var visibleContainer = containers[cardNo];
  for (var i = 0; i < containers.length; i++) {
    var oz = (containers[i] === visibleContainer) ? '1' : '0';
    $(containers[i]).animate({
      opacity: oz
    }, {
      duration: 200,
      queue: false,
    }).css("z-index", oz);
  }
}

loadImage = function(file) {
  var reader = new FileReader();
  reader.onload = function(event) {
    $('#img-card').attr('src', event.target.result);
	
  }
  reader.readAsDataURL(file);
  switchCard(1);
}

loadStats = function(jsonData) 
{
	var perc=0;
	console.log($('.uf-card').html());
	var img=$('.uf-card').html();
  switchCard(2);
  $('.uf-container').css("z-index",1);
  var data = JSON.parse(jsonData);
  
  var bluecol=data["blue_color"];
	console.log(bluecol);
  var blueMarkup=`
  <div class="card">
  <div class="card-content black-text stat-card">
  <h5>Any Blue color object present: </h5>`+bluecol+`
  </div>
  
  </div>`;
  $("#stat-table").append(blueMarkup);
  if (data["success"] == true) 
  {
	
    for (category in data['confidence']) 
	{
		
      var percent = Math.round(parseFloat(data["confidence"][category]) * 100);
	  if(percent>=60)
	  {
	
      var markup =`
      <div class="card">
        <div class="card-content black-text stat-card">
          <span class="card-title capitalize">` + category + `</span>
          <p style="float: left;">Confidence</p>
          <p style="float: right;"><b>` + percent + `%</b></p>
          <div class="progress">
            <div class="determinate" style="width: ` + percent + `%;"></div>
          </div>
        </div>
      </div>`;
      $("#stat-table").append(markup);
	  break;
	  }
	   else
  {
	  var noBottleMarkup=`
  <div class="card">
  <div class="card-content black-text stat-card">
  <h5>No Bottle Present in the picture</h5>
  </div>
  
  </div>`;
  $("#stat-table").append(noBottleMarkup);
  break;
  } 
	  
    }
  }
  
  
  
  else
  {
	  var noBottleMarkup2=`
  <div class="card">
  <div class="card-content black-text stat-card">
  <h5>No Bottle Present in the picture</h5>
  </div>
  
  </div>`;
  $("#stat-table").append(noBottleMarkup2);
  }
  $("#stat-table").append(img);
}

