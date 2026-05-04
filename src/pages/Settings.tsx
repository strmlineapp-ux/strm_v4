import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Card, CardContent } from '../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';
import { HslStringColorPicker } from 'react-colorful';
import { UserCard } from '../components/common/user-card';

const PREDEFINED_SWATCHES = [
  'hsl(0, 84%, 60%)', 'hsl(25, 95%, 53%)', 'hsl(45, 93%, 47%)', 'hsl(88, 62%, 53%)',
  'hsl(142, 71%, 45%)', 'hsl(160, 100%, 37%)', 'hsl(174, 100%, 34%)', 'hsl(188, 95%, 43%)',
  'hsl(207, 90%, 54%)', 'hsl(221, 83%, 61%)', 'hsl(244, 100%, 72%)', 'hsl(262, 88%, 66%)',
  'hsl(271, 91%, 65%)', 'hsl(328, 84%, 60%)', 'hsl(347, 89%, 61%)', 'hsl(358, 86%, 56%)',
];

export default function Settings() {
  const { currentUser, updatePreference, users } = useAuth();
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [modifierPopoverOpen, setModifierPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!modifierPopoverOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      let newModifier = '';
      if (e.key === 'Shift') newModifier = 'shift';
      if (e.key === 'Alt') newModifier = 'alt';
      if (e.key === 'Control') newModifier = 'ctrl';
      if (e.key === 'Meta') newModifier = 'meta';
      if (newModifier) {
        e.preventDefault();
        updatePreference('modifierKey', newModifier);
        setModifierPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modifierPopoverOpen, updatePreference]);

  const checkModifier = (e: React.MouseEvent | React.PointerEvent) => {
    const modifier = currentUser?.modifierKey || 'meta';
    return (
      (modifier === 'shift' && e.shiftKey) ||
      (modifier === 'alt' && e.altKey) ||
      (modifier === 'ctrl' && e.ctrlKey) ||
      (modifier === 'meta' && e.metaKey)
    );
  };

  const modifierIcons: Record<string, string> = {
    'shift': 'keyboard_capslock',
    'alt': 'keyboard_option_key',
    'ctrl': 'keyboard_control_key',
    'meta': 'keyboard_command_key',
  };

  const gradeValues = [-25, 0, 200];
  const opszValues = [20, 24, 40, 48];

  const handleThemeCycle = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const next = themes[(themes.indexOf(currentUser?.theme || 'system') + 1) % themes.length];
    updatePreference('theme', next);
  };

  const handleCaptureReset = (key: string, defaultValue: any) => (e: React.SyntheticEvent) => {
    if (checkModifier(e as React.MouseEvent)) {
      e.stopPropagation();
      e.preventDefault();
      updatePreference(key, defaultValue);
    }
  };

  const colleagues = (users ?? []).filter(u => u.userId !== currentUser?.userId)
    .filter(u => u.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <TooltipProvider delayDuration={200}>
    <div className="h-full p-8 animate-in fade-in duration-500 max-w-5xl mx-auto overflow-y-auto">

      {/* Top: Avatar + Info + Compact Controls */}
      <div className="flex items-start gap-8 mb-12">

        {/* Avatar with Google Calendar Status */}
        <div className="relative group shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border shadow-sm cursor-pointer">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center font-thin text-5xl text-muted-foreground">
                    {currentUser?.displayName?.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-foreground" style={{ fontSize: '28px' }}>photo_camera</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Google Calendar: {currentUser?.googleCalendarLinked ? 'Connected' : 'Not Connected'}</p>
            </TooltipContent>
          </Tooltip>
          {/* Google Calendar status dot */}
          <span
            className={`absolute bottom-1 right-1 block h-3.5 w-3.5 rounded-full ring-2 ring-background ${currentUser?.googleCalendarLinked ? 'bg-green-500' : 'bg-muted-foreground/40'}`}
          />
        </div>

        {/* Name / Email / Role */}
        <div className="flex-1 pt-2">
          <h2 className="text-2xl font-thin tracking-wide mb-0.5">{currentUser?.displayName}</h2>
          <p className="text-muted-foreground text-sm mb-1">{currentUser?.email}</p>
          <div className="inline-flex px-3 py-1 bg-muted/50 rounded-full text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {currentUser?.accountType} User
          </div>
        </div>

        {/* Compact Controls */}
        <Card className="bg-transparent border-none shadow-none shrink-0">
          <CardContent className="p-0">
              <div className="flex items-center gap-3">

                {/* Theme Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                      <div className="group cursor-pointer font-emphasis" onClickCapture={handleCaptureReset('theme', 'system')} onClick={handleThemeCycle}>
                        <div className="flex items-center justify-center transition-all text-muted-foreground">
                          <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                            {currentUser?.theme === 'dark' ? 'dark_mode' : currentUser?.theme === 'system' ? 'routine' : 'water_lux'}
                          </span>
                        </div>
                      </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Theme: {currentUser?.theme || 'system'}</p></TooltipContent>
                </Tooltip>

                {/* Primary Color Badge */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group" onPointerDownCapture={handleCaptureReset('primaryColor', null)} onClickCapture={handleCaptureReset('primaryColor', null)}>
                      <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
                        <PopoverTrigger asChild>
                          <div
                            className="w-6 h-6 rounded-full border-2 border-border shadow-sm transition-transform cursor-pointer"
                            style={{ backgroundColor: currentUser?.primaryColor || 'hsl(210, 70%, 50%)' }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 flex flex-col gap-3">
                          <HslStringColorPicker
                            color={currentUser?.primaryColor || 'hsl(210, 70%, 50%)'}
                            onChange={(c) => updatePreference('primaryColor', c)}
                          />
                          {/* Predefined swatches */}
                          <div className="grid grid-cols-8 gap-1">
                            {PREDEFINED_SWATCHES.map(c => (
                              <button
                                key={c}
                                className="h-5 w-5 rounded-full border border-border/50 transition-transform"
                                style={{ backgroundColor: c }}
                                onClick={() => { updatePreference('primaryColor', c); setColorPopoverOpen(false); }}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Accent Color (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* High Contrast */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer font-emphasis" onClickCapture={handleCaptureReset('highContrast', false)} onClick={() => updatePreference('highContrast', !currentUser?.highContrast)}>
                      <div data-state={currentUser?.highContrast ? 'active' : 'inactive'} className="flex items-center justify-center transition-all text-muted-foreground">
                        <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>contrast</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>High Contrast: {currentUser?.highContrast ? 'On' : 'Off'} (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Modifier Key Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group font-emphasis" onPointerDownCapture={handleCaptureReset('modifierKey', 'meta')} onClickCapture={handleCaptureReset('modifierKey', 'meta')}>
                      <Popover open={modifierPopoverOpen} onOpenChange={setModifierPopoverOpen}>
                        <PopoverTrigger asChild>
                          <div className="flex items-center justify-center transition-all cursor-pointer text-muted-foreground">
                            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                              {modifierIcons[currentUser?.modifierKey || 'meta']}
                            </span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 text-center">
                          <p className="text-sm font-medium mb-1">Press any Modifier Key</p>
                          <p className="text-xs text-muted-foreground">Shift, Alt, Ctrl, or Cmd/Win</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Modifier Key: {currentUser?.modifierKey || 'meta'} (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Font Weight Popover */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group font-emphasis" onPointerDownCapture={handleCaptureReset('fontWeight', 300)} onClickCapture={handleCaptureReset('fontWeight', 300)}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center justify-center transition-all cursor-pointer text-muted-foreground">
                            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>fitness_center</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Font Weight</span>
                            <span className="text-xs text-muted-foreground">{currentUser?.fontWeight ?? 300}</span>
                          </div>
                          <input type="range" min="100" max="700" step="100" value={currentUser?.fontWeight ?? 300} onChange={(e) => updatePreference('fontWeight', Number(e.target.value))} className="w-full thin-slider" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Font Weight (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Icon Grade Popover */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group font-emphasis" onPointerDownCapture={handleCaptureReset('iconGrade', 0)} onClickCapture={handleCaptureReset('iconGrade', 0)}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center justify-center transition-all cursor-pointer text-muted-foreground">
                            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>gradient</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Icon Grade</span>
                            <span className="text-xs text-muted-foreground">{currentUser?.iconGrade ?? 0}</span>
                          </div>
                          <input
                            type="range" min="0" max="2" step="1"
                            value={gradeValues.indexOf(currentUser?.iconGrade ?? 0) !== -1 ? gradeValues.indexOf(currentUser?.iconGrade ?? 0) : 1}
                            onChange={(e) => updatePreference('iconGrade', gradeValues[Number(e.target.value)])}
                            className="w-full thin-slider"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Icon Boldness (Grade) (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Icon Optical Size Popover */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group font-emphasis" onPointerDownCapture={handleCaptureReset('iconOpticalSize', 20)} onClickCapture={handleCaptureReset('iconOpticalSize', 20)}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center justify-center transition-all cursor-pointer text-muted-foreground">
                            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>photo_size_select_large</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Optical Size</span>
                            <span className="text-xs text-muted-foreground">{currentUser?.iconOpticalSize ?? 20}</span>
                          </div>
                          <input
                            type="range" min="0" max="3" step="1"
                            value={opszValues.indexOf(currentUser?.iconOpticalSize ?? 20) !== -1 ? opszValues.indexOf(currentUser?.iconOpticalSize ?? 20) : 0}
                            onChange={(e) => updatePreference('iconOpticalSize', opszValues[Number(e.target.value)])}
                            className="w-full thin-slider"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Icon Optical Size (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Border Radius Popover */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group font-emphasis" onPointerDownCapture={handleCaptureReset('radius', 0.5)} onClickCapture={handleCaptureReset('radius', 0.5)}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center justify-center transition-all cursor-pointer text-muted-foreground">
                            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>rounded_corner</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Border Radius</span>
                            <span className="text-xs text-muted-foreground">{(currentUser?.radius ?? 0.5).toFixed(1)}rem</span>
                          </div>
                          <input
                            type="range" min="0" max="15" step="1"
                            value={(currentUser?.radius ?? 0.5) * 10}
                            onChange={(e) => updatePreference('radius', Number(e.target.value) / 10)}
                            className="w-full thin-slider"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Border Radius (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Icon Fill Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer font-emphasis" onClickCapture={handleCaptureReset('iconFill', 0)} onClick={() => updatePreference('iconFill', currentUser?.iconFill === 1 ? 0 : 1)}>
                      <div data-state={currentUser?.iconFill === 1 ? 'active' : 'inactive'} className="flex items-center justify-center transition-all text-muted-foreground">
                        <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>format_color_fill</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Icon Fill: {currentUser?.iconFill === 1 ? 'On' : 'Off'} (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Easy Booking Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer font-emphasis" onClickCapture={handleCaptureReset('easyBooking', true)} onClick={() => updatePreference('easyBooking', !currentUser?.easyBooking)}>
                      <div data-state={currentUser?.easyBooking ? 'active' : 'inactive'} className="flex items-center justify-center transition-all text-muted-foreground">
                        <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>edit_calendar</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Easy Booking: {currentUser?.easyBooking ? 'On' : 'Off'} (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

                {/* Time Format Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer font-emphasis" onClickCapture={handleCaptureReset('timeFormat', '12h')} onClick={() => updatePreference('timeFormat', currentUser?.timeFormat === '24h' ? '12h' : '24h')}>
                      <div data-state={currentUser?.timeFormat === '24h' ? 'active' : 'inactive'} className="flex items-center justify-center transition-all text-muted-foreground">
                        <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>schedule</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>Time Format: {currentUser?.timeFormat || '12h'} (Modifier+Click to reset)</p></TooltipContent>
                </Tooltip>

              </div>
          </CardContent>
        </Card>
      </div>

      {/* Colleague Directory */}
      <div>
        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: '20px' }}>search</span>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find colleagues..."
            className="w-full bg-muted/30 border-none rounded-full h-10 pl-10 pr-4 focus:ring-1 focus:ring-border focus:outline-none text-sm transition-all"
          />
        </div>

        {/* Grid */}
        {colleagues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {colleagues.map(user => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No colleagues found.</p>
        )}
      </div>

    </div>
    </TooltipProvider>
  );
}
