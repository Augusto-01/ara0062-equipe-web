<?php
declare(strict_types=1);

// Ajuste estes dados ao seu MySQL (XAMPP: usuário root, senha vazia).
const DB_HOST    = 'localhost';
const DB_NOME    = 'catalogoflix';
const DB_USUARIO = 'root';
const DB_SENHA   = '';

function conectar(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NOME . ';charset=utf8mb4',
            DB_USUARIO,
            DB_SENHA,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

// Resposta JSON padrão usada pelo script.js (requer PHP 8.1+).
function responder(bool $ok, string $mensagem, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => $ok, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    exit;
}

function texto(string $campo): string
{
    $valor = $_POST[$campo] ?? '';
    return is_string($valor) ? trim($valor) : '';
}

function exigirPostValido(): void
{
    $tamanho = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($tamanho > 0 && empty($_POST) && empty($_FILES)) {
        responder(false, 'O arquivo enviado é grande demais. Use uma imagem de até 2 MB.', 413);
    }
}
