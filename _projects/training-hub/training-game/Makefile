# Training Game sub-project Makefile
# Generic targets: build, clean, watch

PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
# Parent/master project name (used to namespace distribution)
MASTER_NAME = training-hub
WORKSPACE_ROOT = ../../..

# Distribute under assets/js/projects/<master>/<sub>
JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(MASTER_NAME)/$(PROJECT_NAME)
ASSET_DEST = $(WORKSPACE_ROOT)/assets/projects/$(MASTER_NAME)/$(PROJECT_NAME)

.PHONY: build clean watch

build:
	@echo "📦 Building sub-project: $(PROJECT_NAME) (master: $(MASTER_NAME))"
	@if [ -d levels ]; then \
		mkdir -p $(JS_DEST)/levels; \
		cp levels/*.js $(JS_DEST)/levels/ 2>/dev/null || true; \
	fi
	@if [ -d assets ]; then \
		mkdir -p $(ASSET_DEST); \
		cp -R assets/. $(ASSET_DEST)/ 2>/dev/null || true; \
	fi
	@echo "✅ $(PROJECT_NAME) built to $(JS_DEST)"

clean:
	@echo "🧹 Cleaning sub-project distribution: $(PROJECT_NAME)"
	@rm -rf $(JS_DEST)
	@rm -rf $(ASSET_DEST)
	@echo "✓ $(PROJECT_NAME) cleaned"

watch:
	@if command -v fswatch >/dev/null 2>&1; then \
		echo "👀 Watching $(PROJECT_NAME)..."; \
		fswatch -l 0.3 -r $(PROJECT_SRC)/levels $(PROJECT_SRC)/assets 2>/dev/null | while read changed_file; do \
			filename=$$(basename "$$changed_file"); \
			echo "  🔄 Training game file changed: $$filename"; \
			make build >/dev/null || true; \
		done; \
	else \
		echo "⚠️  fswatch not installed — run 'make -C _projects/$(MASTER_NAME)/$(PROJECT_NAME) build' manually"; \
		while true; do sleep 3600; done; \
	fi
