#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"

@interface ConsoleOverlayViewManager : RCTViewManager
@end

@implementation ConsoleOverlayViewManager

RCT_EXPORT_MODULE(ConsoleOverlayView)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(color, NSString)

@end
