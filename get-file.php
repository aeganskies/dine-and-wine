<?php
  $file = file($_GET['url']);
  echo implode('', $file);
?>