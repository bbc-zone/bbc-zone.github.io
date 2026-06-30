<?php
ob_start();
ini_set('display_errors', '0');
error_reporting(E_ALL);

function writeErrorLog($title, $details = array())
{
    $logDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'log';
    $logFile = $logDirectory . DIRECTORY_SEPARATOR . 'error.log';

    if (!is_dir($logDirectory)) {
        mkdir($logDirectory, 0777, true);
    }

    $requestMethod = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'CLI';
    $requestUri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    $timestamp = date('Y-m-d H:i:s');
    $lines = array(
        '[' . $timestamp . '] ' . $title,
        'Method: ' . $requestMethod,
        'URI: ' . $requestUri,
    );

    foreach ($details as $key => $value) {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value, JSON_PRETTY_PRINT);
        }

        $lines[] = $key . ': ' . $value;
    }

    $lines[] = str_repeat('-', 80);

    file_put_contents($logFile, implode(PHP_EOL, $lines) . PHP_EOL, FILE_APPEND);
}

function sendJsonResponse($payload, $statusCode = 200)
{
    if ($statusCode >= 400 || (isset($payload['success']) && $payload['success'] === false)) {
        writeErrorLog('API error response', array(
            'Status' => $statusCode,
            'Payload' => $payload,
        ));
    }

    if (ob_get_length()) {
        ob_clean();
    }

    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function getProductionPlanStatus($planQty, $actualQty)
{
    $planQty = (int) $planQty;
    $actualQty = (int) $actualQty;

    if ($actualQty <= 0) {
        return 'Open';
    }

    if ($actualQty < $planQty) {
        return 'Partial';
    }

    return 'Complete';
}

set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }

    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function ($exception) {
    writeErrorLog('Unhandled exception', array(
        'Message' => $exception->getMessage(),
        'File' => $exception->getFile(),
        'Line' => $exception->getLine(),
        'Trace' => $exception->getTraceAsString(),
    ));

    sendJsonResponse([
        'success' => false,
        'message' => 'A server error occurred',
        'error' => $exception->getMessage(),
    ], 500);
});

register_shutdown_function(function () {
    $error = error_get_last();
    $fatalTypes = array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR);

    if ($error && in_array($error['type'], $fatalTypes, true)) {
        writeErrorLog('Fatal error', array(
            'Message' => $error['message'],
            'File' => $error['file'],
            'Line' => $error['line'],
            'Type' => $error['type'],
        ));

        sendJsonResponse([
            'success' => false,
            'message' => 'A fatal server error occurred',
            'error' => $error['message'],
        ], 500);
    }

    $statusCode = http_response_code();
    $buffer = ob_get_contents();

    if ($statusCode >= 400 && $buffer) {
        $payload = json_decode($buffer, true);

        writeErrorLog('API error response', array(
            'Status' => $statusCode,
            'Payload' => is_array($payload) ? $payload : $buffer,
        ));
    }
});

$allowedOrigins = array(
    'http://localhost:9997',
    'https://bbc-zone.github.io',
);
$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$responseOrigin = in_array($requestOrigin, $allowedOrigins, true)
    ? $requestOrigin
    : 'https://bbc-zone.github.io';

header('Access-Control-Allow-Origin: ' . $responseOrigin, true);
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

$requestMethod = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
$resource = isset($_GET['resource']) ? $_GET['resource'] : '';

if ($requestMethod === 'OPTIONS') {
    exit;
}

if ($resource === '') {
    $acceptHeader = isset($_SERVER['HTTP_ACCEPT']) ? $_SERVER['HTTP_ACCEPT'] : '';

    if ($requestMethod === 'GET' && stripos($acceptHeader, 'text/html') !== false) {
        header('Location: dist/', true, 302);
        exit;
    }

    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'API resource is required',
    ]);
    exit;
}

$configPath = __DIR__ . DIRECTORY_SEPARATOR . 'db-string.json';

if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'db-string.json file was not found',
    ]);
    exit;
}

$config = json_decode(file_get_contents($configPath), true);

if (!is_array($config)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'db-string.json format is invalid',
    ]);
    exit;
}

$server = isset($config['server']) ? $config['server'] : 'localhost';
$user = isset($config['user']) ? $config['user'] : '';
$pass = isset($config['pass']) ? $config['pass'] : '';
$dbName = isset($config['db_name']) ? $config['db_name'] : '';

$connection = new mysqli($server, $user, $pass, $dbName);

if ($connection->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $connection->connect_error,
    ]);
    exit;
}

$connection->set_charset('utf8mb4');

if ($resource === 'connection-test') {
    $result = $connection->query('SELECT 1 + 1 AS test_result');

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection test failed',
            'error' => $connection->error,
        ]);
        exit;
    }

    $row = $result->fetch_assoc();

    echo json_encode([
        'success' => true,
        'message' => 'API and database connection successful',
        'database' => $dbName,
        'test_query' => 'SELECT 1 + 1',
        'test_result' => isset($row['test_result']) ? (int) $row['test_result'] : null,
    ]);
    exit;
}

if ($resource === 'item-master') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        $input = array();
    }

    if ($requestMethod === 'POST') {
        $itemCode = isset($input['item_code']) ? trim($input['item_code']) : '';
        $itemName = isset($input['item_name']) ? trim($input['item_name']) : '';
        $category = isset($input['category']) ? trim($input['category']) : '';
        $unit = isset($input['unit']) ? trim($input['unit']) : 'pcs';
        $minimumStock = isset($input['minimum_stock']) ? (int) $input['minimum_stock'] : 0;
        $isActive = isset($input['is_active']) ? (int) $input['is_active'] : 1;

        if ($itemCode === '' || $itemName === '') {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Item code and item name are required',
            ]);
            exit;
        }

        $statement = $connection->prepare("
            INSERT INTO item_master (item_code, item_name, category, unit, minimum_stock, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare item creation',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('ssssii', $itemCode, $itemName, $category, $unit, $minimumStock, $isActive);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create item master',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Item master was created successfully',
            'id' => $statement->insert_id,
        ]);
        exit;
    }

    if ($requestMethod === 'PUT') {
        $id = isset($input['id']) ? (int) $input['id'] : 0;
        $itemCode = isset($input['item_code']) ? trim($input['item_code']) : '';
        $itemName = isset($input['item_name']) ? trim($input['item_name']) : '';
        $category = isset($input['category']) ? trim($input['category']) : '';
        $unit = isset($input['unit']) ? trim($input['unit']) : 'pcs';
        $minimumStock = isset($input['minimum_stock']) ? (int) $input['minimum_stock'] : 0;
        $isActive = isset($input['is_active']) ? (int) $input['is_active'] : 1;

        if ($id <= 0 || $itemCode === '' || $itemName === '') {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'ID, item code, and item name are required',
            ]);
            exit;
        }

        $statement = $connection->prepare("
            UPDATE item_master
            SET item_code = ?, item_name = ?, category = ?, unit = ?, minimum_stock = ?, is_active = ?
            WHERE id = ?
        ");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare item update',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('ssssiii', $itemCode, $itemName, $category, $unit, $minimumStock, $isActive, $id);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update item master',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Item master was updated successfully',
        ]);
        exit;
    }

    if ($requestMethod === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        if ($id <= 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Item ID is required',
            ]);
            exit;
        }

        $usageStatement = $connection->prepare("SELECT COUNT(*) AS total FROM production_plans WHERE item_id = ?");

        if (!$usageStatement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to check item usage',
                'error' => $connection->error,
            ]);
            exit;
        }

        $usageStatement->bind_param('i', $id);
        $usageStatement->execute();
        $usageResult = $usageStatement->get_result();
        $usage = $usageResult->fetch_assoc();

        if ((int) $usage['total'] > 0) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'Item cannot be deleted because it is already used in a production plan',
            ]);
            exit;
        }

        $statement = $connection->prepare("DELETE FROM item_master WHERE id = ?");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare item deletion',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('i', $id);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete item master',
                'error' => $statement->error,
            ]);
            exit;
        }

        if ($statement->affected_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Item master was not found',
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Item master was deleted successfully',
        ]);
        exit;
    }

    $result = $connection->query("
        SELECT
            id,
            item_code,
            item_name,
            category,
            unit,
            minimum_stock,
            is_active
        FROM item_master
        ORDER BY item_code ASC
    ");

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to read item master',
            'error' => $connection->error,
        ]);
        exit;
    }

    $items = array();

    while ($row = $result->fetch_assoc()) {
        $items[] = array(
            'id' => (int) $row['id'],
            'item_code' => $row['item_code'],
            'item_name' => $row['item_name'],
            'category' => $row['category'],
            'unit' => $row['unit'],
            'minimum_stock' => (int) $row['minimum_stock'],
            'is_active' => (int) $row['is_active'],
        );
    }

    echo json_encode([
        'success' => true,
        'message' => 'Item master was read successfully',
        'data' => $items,
    ]);
    exit;
}

if ($resource === 'final-step') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        $input = array();
    }

    if ($requestMethod === 'POST') {
        $itemId = isset($input['item_id']) ? (int) $input['item_id'] : 0;
        $planQty = isset($input['plan_qty']) ? (int) $input['plan_qty'] : 0;
        $planDate = isset($input['plan_date']) && trim($input['plan_date']) !== '' ? trim($input['plan_date']) : null;
        if ($itemId <= 0 || $planQty <= 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Item and plan qty are required',
            ]);
            exit;
        }

        $statement = $connection->prepare("
            INSERT INTO production_plans (item_id, plan_qty, plan_date)
            VALUES (?, ?, ?)
        ");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production plan creation',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('iis', $itemId, $planQty, $planDate);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create production plan',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Production plan was created successfully',
            'plan_id' => $statement->insert_id,
        ]);
        exit;
    }

    if ($requestMethod === 'PUT') {
        $planId = isset($input['plan_id']) ? (int) $input['plan_id'] : 0;
        $itemId = isset($input['item_id']) ? (int) $input['item_id'] : 0;
        $planQty = isset($input['plan_qty']) ? (int) $input['plan_qty'] : 0;
        $planDate = isset($input['plan_date']) && trim($input['plan_date']) !== '' ? trim($input['plan_date']) : null;
        if ($planId <= 0 || $itemId <= 0 || $planQty <= 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Plan ID, item, and plan qty are required',
            ]);
            exit;
        }

        $statement = $connection->prepare("
            UPDATE production_plans
            SET item_id = ?, plan_qty = ?, plan_date = ?
            WHERE plan_id = ?
        ");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production plan update',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('iisi', $itemId, $planQty, $planDate, $planId);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update production plan',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Production plan was updated successfully',
        ]);
        exit;
    }

    if ($requestMethod === 'DELETE') {
        $planId = isset($_GET['plan_id']) ? (int) $_GET['plan_id'] : 0;

        if ($planId <= 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Plan ID is required',
            ]);
            exit;
        }

        $statement = $connection->prepare("DELETE FROM production_plans WHERE plan_id = ?");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production plan deletion',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('i', $planId);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete production plan',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Production plan was deleted successfully',
        ]);
        exit;
    }

    $result = $connection->query("
        SELECT
            pp.plan_id,
            pp.item_id,
            im.item_code,
            im.item_name,
            pp.plan_qty,
            pp.plan_date,
            COALESCE(pa.actual_qty_total, 0) AS actual_qty_total
        FROM production_plans pp
        INNER JOIN item_master im ON im.id = pp.item_id
        LEFT JOIN (
            SELECT plan_id, SUM(actual_qty) AS actual_qty_total
            FROM production_actuals
            GROUP BY plan_id
        ) pa ON pa.plan_id = pp.plan_id
        ORDER BY pp.plan_id DESC
    ");

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to read production plan',
            'error' => $connection->error,
        ]);
        exit;
    }

    $plans = array();

    while ($row = $result->fetch_assoc()) {
        $plans[] = array(
            'plan_id' => (int) $row['plan_id'],
            'item_id' => (int) $row['item_id'],
            'item_code' => $row['item_code'],
            'item_name' => $row['item_name'],
            'plan_qty' => (int) $row['plan_qty'],
            'plan_date' => $row['plan_date'],
            'actual_qty_total' => (int) $row['actual_qty_total'],
            'status' => getProductionPlanStatus($row['plan_qty'], $row['actual_qty_total']),
        );
    }

    echo json_encode([
        'success' => true,
        'message' => 'Production plan was read successfully',
        'data' => $plans,
    ]);
    exit;
}

if ($resource === 'production-actual') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        $input = array();
    }

    if ($requestMethod === 'POST') {
        $planId = isset($input['plan_id']) ? (int) $input['plan_id'] : 0;
        $actualQty = isset($input['actual_qty']) ? (int) $input['actual_qty'] : 0;

        if ($planId <= 0 || $actualQty <= 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Plan ID and actual qty are required',
            ]);
            exit;
        }

        $planStatement = $connection->prepare("
            SELECT
                pp.plan_id,
                pp.plan_qty,
                im.item_code,
                COALESCE(pa.actual_qty_total, 0) AS actual_qty_total
            FROM production_plans pp
            INNER JOIN item_master im ON im.id = pp.item_id
            LEFT JOIN (
                SELECT plan_id, SUM(actual_qty) AS actual_qty_total
                FROM production_actuals
                GROUP BY plan_id
            ) pa ON pa.plan_id = pp.plan_id
            WHERE pp.plan_id = ?
        ");

        if (!$planStatement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to check production plan',
                'error' => $connection->error,
            ]);
            exit;
        }

        $planStatement->bind_param('i', $planId);
        $planStatement->execute();
        $planResult = $planStatement->get_result();
        $planRow = $planResult->fetch_assoc();

        if (!$planRow) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Production plan was not found',
            ]);
            exit;
        }

        $remainingQty = max((int) $planRow['plan_qty'] - (int) $planRow['actual_qty_total'], 0);

        if ($actualQty > $remainingQty) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Actual qty must be within the remaining plan qty',
                'remaining_qty' => $remainingQty,
            ]);
            exit;
        }

        $connection->begin_transaction();
        $actualDateTime = date('Y-m-d H:i:s');
        $itemCodePrefix = substr(strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $planRow['item_code'])), 0, 2);
        $itemCodePrefix = str_pad($itemCodePrefix, 2, '0', STR_PAD_RIGHT);
        $actualCodeDate = date('Ymd', strtotime($actualDateTime));
        $actualCodeTime = date('His', strtotime($actualDateTime));
        $uniqueCodePrefix = $itemCodePrefix . $actualCodeDate . $actualCodeTime;
        $sequenceStatement = $connection->prepare("
            SELECT MAX(CAST(RIGHT(unique_code, 6) AS UNSIGNED)) AS last_sequence
            FROM production_actuals
            WHERE unique_code LIKE CONCAT(?, '%')
              AND unique_code REGEXP '[0-9]{6}$'
        ");

        if (!$sequenceStatement) {
            $connection->rollback();
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production actual sequence',
                'error' => $connection->error,
            ]);
            exit;
        }

        $sequenceStatement->bind_param('s', $uniqueCodePrefix);

        if (!$sequenceStatement->execute()) {
            $connection->rollback();
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to read production actual sequence',
                'error' => $sequenceStatement->error,
            ]);
            exit;
        }

        $sequenceResult = $sequenceStatement->get_result();
        $sequenceRow = $sequenceResult->fetch_assoc();
        $nextSequence = isset($sequenceRow['last_sequence']) ? (int) $sequenceRow['last_sequence'] + 1 : 1;
        $sequenceCode = str_pad((string) $nextSequence, 6, '0', STR_PAD_LEFT);
        $uniqueCode = $uniqueCodePrefix . $sequenceCode;

        $statement = $connection->prepare("
            INSERT INTO production_actuals (unique_code, plan_id, actual_date, actual_qty)
            VALUES (?, ?, ?, ?)
        ");

        if (!$statement) {
            $connection->rollback();
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production actual creation',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('sisi', $uniqueCode, $planId, $actualDateTime, $actualQty);

        if (!$statement->execute()) {
            $connection->rollback();
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create production actual',
                'error' => $statement->error,
            ]);
            exit;
        }

        $actualId = $statement->insert_id;
        $connection->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Production actual was created successfully',
            'actual_id' => $actualId,
            'unique_code' => $uniqueCode,
        ]);
        exit;
    }

    if ($requestMethod === 'PUT') {
        $actualId = isset($input['actual_id']) ? (int) $input['actual_id'] : 0;
        $actualQty = isset($input['actual_qty']) ? (int) $input['actual_qty'] : 0;

        if ($actualId <= 0 || $actualQty < 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Actual ID and actual qty are required',
            ]);
            exit;
        }

        $actualPlanStatement = $connection->prepare("
            SELECT
                pa.actual_id,
                pa.actual_qty AS current_actual_qty,
                pp.plan_qty,
                COALESCE(total_actual.actual_qty_total, 0) AS actual_qty_total
            FROM production_actuals pa
            INNER JOIN production_plans pp ON pp.plan_id = pa.plan_id
            LEFT JOIN (
                SELECT plan_id, SUM(actual_qty) AS actual_qty_total
                FROM production_actuals
                GROUP BY plan_id
            ) total_actual ON total_actual.plan_id = pa.plan_id
            WHERE pa.actual_id = ?
        ");

        if (!$actualPlanStatement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to check production actual qty limit',
                'error' => $connection->error,
            ]);
            exit;
        }

        $actualPlanStatement->bind_param('i', $actualId);
        $actualPlanStatement->execute();
        $actualPlanResult = $actualPlanStatement->get_result();
        $actualPlanRow = $actualPlanResult->fetch_assoc();

        if (!$actualPlanRow) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Production actual was not found',
            ]);
            exit;
        }

        $editableRemainingQty = max(
            (int) $actualPlanRow['plan_qty'] - ((int) $actualPlanRow['actual_qty_total'] - (int) $actualPlanRow['current_actual_qty']),
            0
        );

        if ($actualQty > $editableRemainingQty) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Actual qty must be within the remaining plan qty',
                'remaining_qty' => $editableRemainingQty,
            ]);
            exit;
        }

        $statement = $connection->prepare("
            UPDATE production_actuals
            SET actual_qty = ?
            WHERE actual_id = ?
        ");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production actual update',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('ii', $actualQty, $actualId);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update production actual',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Production actual was updated successfully',
        ]);
        exit;
    }

    if ($requestMethod === 'DELETE') {
        $actualId = isset($_GET['actual_id']) ? (int) $_GET['actual_id'] : 0;

        if ($actualId <= 0) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Actual ID is required',
            ]);
            exit;
        }

        $actualStatement = $connection->prepare("
            SELECT actual_id, unique_code, actual_qty
            FROM production_actuals
            WHERE actual_id = ?
        ");

        if (!$actualStatement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production actual check',
                'error' => $connection->error,
            ]);
            exit;
        }

        $actualStatement->bind_param('i', $actualId);
        $actualStatement->execute();
        $actualResult = $actualStatement->get_result();
        $actualRow = $actualResult->fetch_assoc();

        if (!$actualRow) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Production actual was not found',
            ]);
            exit;
        }

        $stockMovementTable = null;
        $stockMovementResult = $connection->query("SHOW TABLES LIKE 'stock_movement'");

        if ($stockMovementResult && $stockMovementResult->num_rows > 0) {
            $stockMovementTable = 'stock_movement';
        } else {
            $stockMovementResult = $connection->query("SHOW TABLES LIKE 'stock_movements'");

            if ($stockMovementResult && $stockMovementResult->num_rows > 0) {
                $stockMovementTable = 'stock_movements';
            }
        }

        if ($stockMovementTable) {
            $stockStatement = $connection->prepare("
                SELECT COALESCE(SUM(qty_in - qty_out), 0) AS available_qty
                FROM `$stockMovementTable`
                WHERE barcode = ?
            ");

            if (!$stockStatement) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to prepare stock movement check',
                    'error' => $connection->error,
                ]);
                exit;
            }

            $stockStatement->bind_param('s', $actualRow['unique_code']);
            $stockStatement->execute();
            $stockResult = $stockStatement->get_result();
            $stockRow = $stockResult->fetch_assoc();
            $availableQty = isset($stockRow['available_qty']) ? (int) $stockRow['available_qty'] : 0;
            $actualQty = (int) $actualRow['actual_qty'];

            if (($availableQty - $actualQty) < 0) {
                $remainingQtyAfterDelete = $availableQty - $actualQty;

                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => 'Insufficient stock to delete this data. Remaining qty: ' . $availableQty,
                    'available_qty' => $availableQty,
                    'delete_qty' => $actualQty,
                    'remaining_qty_after_delete' => $remainingQtyAfterDelete,
                ]);
                exit;
            }
        }

        $statement = $connection->prepare("DELETE FROM production_actuals WHERE actual_id = ?");

        if (!$statement) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to prepare production actual deletion',
                'error' => $connection->error,
            ]);
            exit;
        }

        $statement->bind_param('i', $actualId);

        if (!$statement->execute()) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete production actual',
                'error' => $statement->error,
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Production actual was deleted successfully',
        ]);
        exit;
    }

    $planId = isset($_GET['plan_id']) ? (int) $_GET['plan_id'] : 0;

    if ($planId <= 0) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Plan ID is required',
        ]);
        exit;
    }

    $planStatement = $connection->prepare("
        SELECT
            pp.plan_id,
            pp.item_id,
            im.item_code,
            im.item_name,
            pp.plan_qty,
            pp.plan_date,
            COALESCE(pa.actual_qty_total, 0) AS actual_qty_total
        FROM production_plans pp
        INNER JOIN item_master im ON im.id = pp.item_id
        LEFT JOIN (
            SELECT plan_id, SUM(actual_qty) AS actual_qty_total
            FROM production_actuals
            GROUP BY plan_id
        ) pa ON pa.plan_id = pp.plan_id
        WHERE pp.plan_id = ?
    ");

    if (!$planStatement) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to prepare production plan read',
            'error' => $connection->error,
        ]);
        exit;
    }

    $planStatement->bind_param('i', $planId);
    $planStatement->execute();
    $planResult = $planStatement->get_result();
    $planRow = $planResult->fetch_assoc();

    if (!$planRow) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Production plan was not found',
        ]);
        exit;
    }

    $actualStatement = $connection->prepare("
        SELECT
            actual_id,
            unique_code,
            plan_id,
            actual_date,
            actual_qty
        FROM production_actuals
        WHERE plan_id = ?
        ORDER BY actual_date DESC, actual_id DESC
    ");

    if (!$actualStatement) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to prepare production actual read',
            'error' => $connection->error,
        ]);
        exit;
    }

    $actualStatement->bind_param('i', $planId);
    $actualStatement->execute();
    $actualResult = $actualStatement->get_result();
    $actualRows = array();

    while ($row = $actualResult->fetch_assoc()) {
        $actualRows[] = array(
            'actual_id' => (int) $row['actual_id'],
            'unique_code' => $row['unique_code'],
            'plan_id' => (int) $row['plan_id'],
            'actual_date' => $row['actual_date'],
            'actual_qty' => (int) $row['actual_qty'],
        );
    }

    echo json_encode([
        'success' => true,
        'message' => 'Production actual was read successfully',
        'plan' => array(
            'plan_id' => (int) $planRow['plan_id'],
            'item_id' => (int) $planRow['item_id'],
            'item_code' => $planRow['item_code'],
            'item_name' => $planRow['item_name'],
            'plan_qty' => (int) $planRow['plan_qty'],
            'plan_date' => $planRow['plan_date'],
            'actual_qty_total' => (int) $planRow['actual_qty_total'],
            'status' => getProductionPlanStatus($planRow['plan_qty'], $planRow['actual_qty_total']),
        ),
        'data' => $actualRows,
    ]);
    exit;
}

http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'API resource was not found',
]);
