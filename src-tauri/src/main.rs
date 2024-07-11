// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::AppHandle;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn exit_command(app_handle: AppHandle) {
    app_handle.exit(0)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![exit_command])
        .plugin(tauri_plugin_context_menu::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
