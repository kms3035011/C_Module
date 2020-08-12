<?php
    function autoload($f){
        require "$f.php";
}

spl_autoload_register("autoload");
function script($t=""){ // script
	echo "<script>$t</script>";
}