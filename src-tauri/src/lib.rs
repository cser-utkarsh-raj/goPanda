use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize};

#[tauri::command]
fn switch_view_mode(app: AppHandle, mode: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        if mode == "widget" {
            if let Ok(Some(monitor)) = window.primary_monitor() {
                let screen_size = monitor.size();
                let widget_w = 170u32;
                let widget_h = 190u32;
                let x = screen_size.width.saturating_sub(widget_w + 30);
                let y = screen_size.height.saturating_sub(widget_h + 60);

                let _ = window.set_resizable(false);
                let _ = window.set_size(PhysicalSize::new(widget_w, widget_h));
                let _ = window.set_position(PhysicalPosition::new(x as i32, y as i32));
                let _ = window.set_always_on_top(true);
            }
            let _ = window.emit("mode-changed", "widget");
        } else {
            if let Ok(Some(monitor)) = window.primary_monitor() {
                let screen_size = monitor.size();
                let full_w = std::cmp::min(1240u32, screen_size.width.saturating_sub(100));
                let full_h = std::cmp::min(840u32, screen_size.height.saturating_sub(80));

                let _ = window.set_always_on_top(false);
                let _ = window.set_resizable(true);
                let _ = window.set_size(PhysicalSize::new(full_w, full_h));
                let _ = window.center();
            }
            let _ = window.emit("mode-changed", "full");
        }
        Ok(())
    } else {
        Err("Main window not found".into())
    }
}

#[tauri::command]
fn toggle_fullscreen(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(is_full) = window.is_fullscreen() {
            let _ = window.set_fullscreen(!is_full);
        }
        Ok(())
    } else {
        Err("Main window not found".into())
    }
}

#[tauri::command]
fn minimize_app(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.minimize();
        Ok(())
    } else {
        Err("Main window not found".into())
    }
}

#[tauri::command]
fn close_app(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.close();
        Ok(())
    } else {
        Err("Main window not found".into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            switch_view_mode,
            toggle_fullscreen,
            minimize_app,
            close_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running goPanda tauri application");
}
