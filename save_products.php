<?php
// save_products.php - Hostinger API Bridge
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $payload = json_decode($json);
    
    if ($payload === null || !isset($payload->type) || !isset($payload->data)) {
        echo json_encode(['status' => 'error', 'message' => 'Geçersiz veri formatı']);
        exit;
    }

    $filename = ($payload->type === 'categories') ? 'categories.json' : 'products.json';
    $dataToSave = json_encode($payload->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if (file_put_contents($filename, $dataToSave)) {
        echo json_encode(['status' => 'success', 'message' => $payload->type . ' başarıyla kaydedildi']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Dosya yazılamadı. Yazma izinlerini kontrol edin.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Sadece POST istekleri kabul edilir']);
}
?>
